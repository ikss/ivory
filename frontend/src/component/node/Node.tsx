import {Item} from "../view/Item";
import {NodePatroni} from "./NodePatroni";
import {NodeCluster} from "./NodeCluster";
import {NodeConfig} from "./NodeConfig";
import {Alert, Box, Grid, Tab, Tabs} from "@mui/material";
import React, {useState} from "react";
import {useStore} from "../../provider/StoreProvider";

export function Node() {
    const { store: { activeNode } } = useStore()
    const [tab, setTab] = useState(0)

    return (
        <Grid container>
            <Item>
                <Tabulation />
                <Box sx={{ padding: '10px 20px 15px' }}>
                    {!activeNode ? <NonSelectedBlock /> : <ActiveBlock />}
                </Box>
            </Item>
        </Grid>
    )

    function Tabulation() {
        return (
            <Tabs value={tab} onChange={(_, value) => setTab(value)} centered>
                <Tab label={"Overview"} disabled={!activeNode} />
                <Tab label={"Cluster"} disabled={!activeNode} />
                <Tab label={"Config"} disabled={!activeNode} />
                <Tab label={"Cleaning"} disabled={!activeNode} />
            </Tabs>
        )
    }

    function NonSelectedBlock() {
        return <Info text={"Please, select any node to see information!"} />
    }

    function ActiveBlock() {
        switch (tab) {
            case 0: return <NodePatroni node={activeNode} />
            case 1: return <NodeCluster node={activeNode} />
            case 2: return <NodeConfig node={activeNode} />
            default: return <Info text={"Coming soon — we're working on it!"} />
        }
    }

    function Info(props: { text: string }) {
        return (
            <Alert sx={{ justifyContent: 'center' }} severity={"info"} variant={"outlined"} icon={false}>
                {props.text}
            </Alert>
        )
    }
}
