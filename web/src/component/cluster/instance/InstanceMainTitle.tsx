import {Alert, Box, Collapse, ToggleButton, Tooltip} from "@mui/material";
import {ReactNode, useState} from "react";
import {SxPropsMap} from "../../../type/common";
import {InfoOutlined} from "@mui/icons-material";

const SX: SxPropsMap = {
    box: {display: "flex", flexDirection: "column"},
    title: {display: "flex", justifyContent: "space-between", alignItems: "center", gap: 3},
    label: {flexGrow: 1, fontWeight: "bold", fontSize: "30px"},
    toggle: {padding: "3px"},
    buttons: {display: "flex", alignItems: "center", gap: 1},
}

type Props = {
    label: string,
    info: ReactNode,
    renderActions?: ReactNode,
}

export function InstanceMainTitle(props: Props) {
    const {label, info, renderActions} = props
    const [alert, setAlert] = useState(false)

    return (
        <Box sx={SX.box}>
            <Box sx={SX.title}>
                <Box sx={SX.label}>{label}</Box>
                <Box sx={SX.buttons}>
                    {renderActions}
                    <ToggleButton sx={SX.toggle} value={"info"} size={"small"} selected={alert} onClick={() => setAlert(!alert)}>
                        <Tooltip title={"Description"} placement={"top"}>
                            <InfoOutlined/>
                        </Tooltip>
                    </ToggleButton>
                </Box>
            </Box>
            <Collapse in={alert}>
                <Alert severity={"info"} onClose={() => setAlert(false)}>{info}</Alert>
            </Collapse>
        </Box>
    )
}
