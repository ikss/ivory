import {Database, Query, QueryCreation, QueryType, SxPropsMap} from "../../../app/types";
import {Box, Paper} from "@mui/material";
import {
    CancelIconButton,
    DeleteIconButton,
    EditIconButton,
    PlayIconButton,
    RestoreIconButton
} from "../../view/IconButtons";
import {useTheme} from "../../../provider/ThemeProvider";
import {useState} from "react";
import {QueryItemInfo} from "./QueryItemInfo";
import {QueryItemEdit} from "./QueryItemEdit";
import {QueryItemRun} from "./QueryItemRun";
import {QueryItemRestore} from "./QueryItemRestore";
import {QueryItemBody} from "./QueryItemBody";
import {useMutationOptions} from "../../../hook/QueryCustom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {queryApi} from "../../../app/api";

const SX: SxPropsMap = {
    box: {display: "flex", flexDirection: "column", fontSize: "15px"},
    head: {display: "flex", padding: "5px 15px"},
    title: {flexGrow: 1, display: "flex", alignItems: "center", cursor: "pointer", gap: 1},
    name: {fontWeight: "bold"},
    creation: {fontSize: "12px", fontFamily: "monospace"},
    buttons: {display: "flex", alignItems: "center"},
    type: {padding: "0 8px", cursor: "pointer"},
}

enum BodyType {INFO, EDIT, RESTORE, RUN}

type Props = {
    id: string,
    query: Query,
    cluster: string,
    db: Database,
    type: QueryType,
}

export function QueryItem(props: Props) {
    const {id, query, cluster, db, type} = props
    const {info} = useTheme()
    const [body, setBody] = useState<BodyType>()
    const open = body !== undefined

    const result = useQuery(
        ["query", "run", id],
        () => queryApi.run({queryUuid: id, clusterName: cluster, db}),
        {enabled: false, retry: false},
    )

    const removeOptions = useMutationOptions([["query", "map", type]])
    const remove = useMutation(queryApi.delete, removeOptions)

    return (
        <Paper sx={SX.box} variant={"outlined"}>
            <Box sx={SX.head}>
                <Box sx={SX.title} onClick={open ? handleCancel : handleToggleBody(BodyType.INFO)}>
                    <Box sx={SX.name}>{query.name}</Box>
                    <Box sx={{...SX.creation, color: info?.palette.text.disabled}}>({query.creation})</Box>
                </Box>
                <Box sx={SX.buttons}>
                    {!open && query.creation === QueryCreation.Manual && (
                        <DeleteIconButton loading={remove.isLoading} onClick={handleDelete}/>
                    )}
                    {renderCancelButton()}
                    {!open && query.default !== query.custom && (
                        <RestoreIconButton onClick={handleToggleBody(BodyType.RESTORE)}/>
                    )}
                    {!open && <EditIconButton onClick={handleToggleBody(BodyType.EDIT)}/>}
                    <PlayIconButton color={"success"} loading={result.isFetching} onClick={handleRun}/>
                </Box>
            </Box>
            <QueryItemBody show={body === BodyType.INFO}>
                <QueryItemInfo query={query.custom} description={query.description}/>
            </QueryItemBody>
            <QueryItemBody show={body === BodyType.EDIT}>
                <QueryItemEdit id={id} query={query.custom}/>
            </QueryItemBody>
            <QueryItemBody show={body === BodyType.RESTORE}>
                <QueryItemRestore id={id} def={query.default} custom={query.custom}/>
            </QueryItemBody>
            <QueryItemBody show={body === BodyType.RUN}>
                <QueryItemRun data={result.data} error={result.error} loading={result.isLoading}/>
            </QueryItemBody>
        </Paper>
    )

    function renderCancelButton() {
        if (!open) return
        return (
            <>
                <Box sx={{...SX.type, color: info?.palette.text.disabled}} onClick={handleCancel}>
                    {BodyType[body]}
                </Box>
                <CancelIconButton onClick={handleCancel}/>
            </>
        )
    }

    function handleCancel() {
        setBody(undefined)
    }

    function handleToggleBody(type: BodyType) {
        return () => setBody(type)
    }

    function handleRun() {
        result.refetch().then()
        handleToggleBody(BodyType.RUN)()
    }

    function handleDelete() {
        remove.mutate(id)
    }
}