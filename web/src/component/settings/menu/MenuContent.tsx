import {Settings, SxPropsMap} from "../../../type/common";
import {MenuItemBox} from "./MenuItemBox";
import {MenuItemText} from "./MenuItemText";
import {MenuItemButton} from "./MenuItemButton";
import {MenuThemeChanger} from "./MenuThemeChanger";
import {EraseButton} from "../../shared/erase/EraseButton";
import {MenuWrapper} from "./MenuWrapper";
import {MenuRefetchChanger} from "./MenuRefetchChanger";
import {Box} from "@mui/material";

const SX: SxPropsMap = {
    list: {display: "flex", flexDirection: "column", gap: 3},
}

type Props = {
    onUpdate: (item: Settings) => void
}

export function MenuContent(props: Props) {
    const {onUpdate} = props

    return (
        <MenuWrapper>
            <Box sx={SX.list}>
                <MenuItemBox name={"Appearance"}>
                    <MenuItemText title={"Theme"} button={<MenuThemeChanger/>}/>
                    <MenuItemText title={"Refetch on window focus"} button={<MenuRefetchChanger/>}/>
                </MenuItemBox>
                <MenuItemBox name={"Privacy and security"}>
                    <MenuItemButton item={Settings.PASSWORD} onUpdate={onUpdate}/>
                    <MenuItemButton item={Settings.CERTIFICATE} onUpdate={onUpdate}/>
                    <MenuItemButton item={Settings.SECRET} onUpdate={onUpdate}/>
                </MenuItemBox>
                <MenuItemBox name={"Danger Zone"}>
                    <MenuItemText
                        title={"Erase all data"}
                        description={"Once you erase all data, there is no going back. Please be certain."}
                        button={<EraseButton safe={true}/>}
                    />
                </MenuItemBox>
                <MenuItemBox name={"About"}>
                    <MenuItemButton item={Settings.ABOUT} onUpdate={onUpdate}/>
                </MenuItemBox>
            </Box>
        </MenuWrapper>
    )
}
