import {Box, Paper} from "@mui/material";
import {
    CancelIconButton,
    DeleteIconButton,
    EditIconButton,
    PlayIconButton,
    RestoreIconButton
} from "../../view/button/IconButtons";
import {useAppearance} from "../../../provider/AppearanceProvider";
import {useState} from "react";
import {QueryItemInfo} from "./QueryItemInfo";
import {QueryItemEdit} from "./QueryItemEdit";
import {QueryItemRestore} from "./QueryItemRestore";
import {QueryItemBody} from "./QueryItemBody";
import {useMutationOptions} from "../../../hook/QueryCustom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {queryApi} from "../../../app/api";
import {QueryItemRun} from "./QueryItemRun";
import {Database, SxPropsMap} from "../../../type/common";
import {Query, QueryCreation, QueryType} from "../../../type/query";
import select from "../../../style/select.module.css";

const SX: SxPropsMap = {
    item: {fontSize: "15px"},
    head: {display: "flex", padding: "5px 15px"},
    title: {flexGrow: 1, display: "flex", alignItems: "center", cursor: "pointer", gap: 1},
    name: {fontWeight: "bold"},
    creation: {fontSize: "12px", fontFamily: "monospace"},
    buttons: {display: "flex", alignItems: "center"},
    type: {padding: "0 8px", cursor: "pointer", color: "text.disabled"},
}

enum BodyType {INFO, EDIT, RESTORE, RUN}

type Props = {
    query: Query,
    credentialId?: string,
    db: Database,
    type: QueryType,
    editable: boolean,
}

export function QueryItem(props: Props) {
    const {query, credentialId, db, type, editable} = props
    const {info} = useAppearance()
    const [body, setBody] = useState<BodyType>()
    const open = body !== undefined

    const result = useQuery(
        ["query", "run", query.id],
        () => queryApi.run({queryUuid: query.id, credentialId, db}),
        {enabled: false, retry: false},
    )

    const removeOptions = useMutationOptions([["query", "map", type]])
    const remove = useMutation(queryApi.delete, removeOptions)
    const cancel = useMutation(queryApi.cancel, {onSuccess: () => result.refetch()})
    const terminate = useMutation(queryApi.terminate, {onSuccess: () => result.refetch()})

    return (
        <Paper sx={SX.item} variant={"outlined"}>
            <Box sx={SX.head} className={select.none}>
                <Box sx={SX.title} onClick={open ? handleCancel : handleToggleBody(BodyType.INFO)}>
                    <Box sx={SX.name}>{query.name}</Box>
                    <Box sx={{...SX.creation, color: info?.palette.text.disabled}}>({query.creation})</Box>
                </Box>
                <Box sx={SX.buttons}>
                    {renderButtons()}
                    <PlayIconButton color={"success"} loading={result.isFetching} onClick={handleRun}/>
                </Box>
            </Box>
            <QueryItemBody show={body === BodyType.INFO}>
                <QueryItemInfo query={query.custom} description={query.description}/>
            </QueryItemBody>
            <QueryItemBody show={body === BodyType.EDIT}>
                <QueryItemEdit id={query.id} query={query.custom}/>
            </QueryItemBody>
            <QueryItemBody show={body === BodyType.RESTORE}>
                <QueryItemRestore id={query.id} def={query.default} custom={query.custom}/>
            </QueryItemBody>
            <QueryItemBody show={body === BodyType.RUN}>
                <QueryItemRun
                    data={result.data}
                    error={result.error}
                    loading={result.isFetching || cancel.isLoading || terminate.isLoading}
                    onCancel={(pid) => cancel.mutate({pid, credentialId, db})}
                    onTerminate={(pid) => terminate.mutate({pid, credentialId, db})}
                />
            </QueryItemBody>
        </Paper>
    )

    function renderButtons() {
        if (open) return renderCancelButton(BodyType[body])
        return (
            <>
                {query.default !== query.custom && (
                    <RestoreIconButton onClick={handleToggleBody(BodyType.RESTORE)}/>
                )}
                {query.creation === QueryCreation.Manual && (
                    <DeleteIconButton loading={remove.isLoading} onClick={handleDelete}/>
                )}
                {editable && (
                    <EditIconButton onClick={handleToggleBody(BodyType.EDIT)}/>
                )}
            </>
        )
    }

    function renderCancelButton(type: string) {
        return (
            <>
                <Box sx={SX.type} onClick={handleCancel}>{type}</Box>
                <CancelIconButton disabled={result.isFetching} onClick={handleCancel}/>
            </>
        )
    }

    function handleCancel() {
        if (!result.isFetching) setBody(undefined)
    }

    function handleToggleBody(type: BodyType) {
        return () => setBody(type)
    }

    function handleRun() {
        setBody(BodyType.RUN)
        result.refetch().then()
    }

    function handleDelete() {
        remove.mutate(query.id)
    }
}
