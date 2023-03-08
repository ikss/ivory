import {Grid, Skeleton} from "@mui/material";
import {InstanceColor} from "../../../app/utils";
import {SxPropsMap} from "../../../app/types";

const SX: SxPropsMap = {
    instanceStatusBlock: {
        height: "120px", minWidth: "250px", borderRadius: "4px",
        color: "white", fontSize: "24px", fontWeight: 900,
    },
}

type Props = {
    role?: string,
    loading: boolean,
}

export function InstanceStatus(props: Props) {
    const {role, loading} = props
    if (loading) return <Skeleton variant="rectangular" sx={SX.instanceStatusBlock}/>
    const background = role && InstanceColor[role]

    return (
        <Grid container alignContent="center" justifyContent="center" sx={{...SX.instanceStatusBlock, background}}>
            <Grid item>{role?.toUpperCase() ?? "unknown"}</Grid>
        </Grid>
    )
}
