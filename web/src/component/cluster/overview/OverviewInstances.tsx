import {Box, Button, Radio, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from "@mui/material";
import {useIsFetching, useMutation} from "@tanstack/react-query";
import {instanceApi} from "../../../app/api";
import {useState} from "react";
import {TableCellLoader} from "../../view/table/TableCellLoader";
import {InstanceColor} from "../../../app/utils";
import {AlertDialog} from "../../view/dialog/AlertDialog";
import {useStore} from "../../../provider/StoreProvider";
import {TabProps} from "./Overview";
import {WarningAmberRounded} from "@mui/icons-material";
import {useMutationOptions} from "../../../hook/QueryCustom";
import {SxPropsMap} from "../../../type/common";
import {InstanceWeb} from "../../../type/Instance";

const SX: SxPropsMap = {
    table: {"tr:last-child td": {border: 0}},
    row: {cursor: "pointer"},
    cell: {padding: "5px 10px", height: "50px"},
    cellSmall: {padding: "5px 0", height: "50px"},
    actionCell: {width: "1%"},
    warningCell: {width: "1%"},
    roleCell: {width: "110px"},
    buttonCell: {width: "160px"},
    warning: {display: "flex", justifyContent: "center"},
}

type AlertDialogState = { open: boolean, title: string, content: string, onAgree: () => void }
const initAlertDialog = {
    open: false, title: "", content: "", onAgree: () => void 0
}

export function OverviewInstances({info}: TabProps) {
    const {cluster, combinedInstanceMap} = info
    const [alertDialog, setAlertDialog] = useState<AlertDialogState>(initAlertDialog)
    const {setInstance, isInstanceActive} = useStore()
    const queryKey = ["instance/overview", cluster.name]
    const instanceMapFetching = useIsFetching(queryKey)
    const options = useMutationOptions([queryKey])
    const switchover = useMutation(instanceApi.switchover, options)
    const reinit = useMutation(instanceApi.reinitialize, options)

    return (
        <>
            <AlertDialog {...alertDialog} onClose={() => setAlertDialog({...alertDialog, open: false})}/>
            <Table size={"small"} sx={SX.table}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={SX.actionCell}/>
                        <TableCell sx={SX.warningCell}/>
                        <TableCell sx={SX.roleCell}>Role</TableCell>
                        <TableCell align={"center"}>Patroni</TableCell>
                        <TableCell align={"center"}>Postgres</TableCell>
                        <TableCell align={"center"}>State</TableCell>
                        <TableCell align={"center"}>Lag</TableCell>
                        <TableCellLoader
                            sx={SX.buttonCell}
                            isFetching={(instanceMapFetching > 0 || switchover.isLoading || reinit.isLoading)}
                        />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderContent()}
                </TableBody>
            </Table>
        </>
    )

    function renderContent() {
        return Object.entries(combinedInstanceMap).map(([key, element]) => {
            const {role, sidecar, database, state, lag, inInstances, inCluster} = element
            const checked = isInstanceActive(key)

            return (
                <TableRow sx={SX.row} key={key} onClick={handleCheck(element, checked)}>
                    <TableCell sx={SX.cell}><Radio checked={checked} size={"small"}/></TableCell>
                    <TableCell sx={SX.cellSmall} align={"center"}>{renderWarning(inCluster, inInstances)}</TableCell>
                    <TableCell sx={{color: InstanceColor[role]}}>{role.toUpperCase()}</TableCell>
                    <TableCell sx={SX.cell} align={"center"}>
                        {sidecar.host}:{sidecar.port === 0 ? "-" : sidecar.port}
                    </TableCell>
                    <TableCell sx={SX.cell} align={"center"}>
                        {database.host}:{database.port === 0 ? "-" : database.port}
                    </TableCell>
                    <TableCell sx={SX.cell} align={"center"}>{state}</TableCell>
                    <TableCell sx={SX.cell} align={"center"}>{lag}</TableCell>
                    <TableCell sx={SX.cell} align={"right"} onClick={(e) => e.stopPropagation()}>
                        <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                            {renderButton(element, role)}
                        </Box>
                    </TableCell>
                </TableRow>
            )
        })
    }

    function renderButton(instance: InstanceWeb, type: string) {
        switch (type) {
            case "replica":
                return (
                    <Button
                        color={"primary"}
                        disabled={reinit.isLoading || switchover.isLoading}
                        onClick={() => handleReinit(instance)}>
                        Reinit
                    </Button>
                )
            case "leader":
                return (
                    <Button
                        color={"secondary"}
                        disabled={switchover.isLoading}
                        onClick={() => handleSwitchover(instance)}>
                        Switchover
                    </Button>
                )
            default:
                return null
        }

    }

    function renderWarning(inCluster: boolean, inInstances: boolean) {
        if (inCluster && inInstances) return null

        let title = "Instance is not in cluster list or cluster itself!"
        if (inCluster && !inInstances) title = "Instance is not in your cluster list!"
        if (!inCluster && inInstances) title = "Instance is not in cluster!"

        return (
            <Box sx={SX.warning}>
                <Tooltip title={title} placement={"top"}>
                    <WarningAmberRounded color={"warning"}/>
                </Tooltip>
            </Box>
        )
    }

    function handleCheck(instance: InstanceWeb, checked: boolean) {
        return () => setInstance(checked ? undefined : instance)
    }

    function handleSwitchover(instance: InstanceWeb) {
        setAlertDialog({
            open: true,
            title: `Make a switchover of ${instance.sidecar.host}?`,
            content: "It will change the leader of your cluster that will cause some downtime.",
            onAgree: () => switchover.mutate({
                ...instance.sidecar,
                credentialId: cluster.credentials.patroniId,
                certs: cluster.certs,
                body: {leader: instance.sidecar.host},
            })
        })
    }

    function handleReinit(instance: InstanceWeb) {
        setAlertDialog({
            open: true,
            title: `Make a reinitialization of ${instance.sidecar.host}?`,
            content: "It will erase all node data and will download it from scratch.",
            onAgree: () => reinit.mutate({
                ...instance.sidecar,
                credentialId: cluster.credentials.patroniId,
                certs: cluster.certs,
            })
        })
    }
}
