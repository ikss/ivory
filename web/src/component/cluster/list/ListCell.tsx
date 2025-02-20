import {ReactNode} from "react";
import {TableCell} from "@mui/material";
import {SxPropsMap} from "../../../type/common";

const SX: SxPropsMap = {
    cell: {verticalAlign: "top"},
}

type Props = {
    children: ReactNode
}

export function ListCell(props: Props) {
    const { children } = props
    return (
        <TableCell sx={SX.cell}>{children}</TableCell>
    )
}
