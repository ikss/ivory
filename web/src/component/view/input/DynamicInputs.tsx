import {Box, Chip, FormControl, OutlinedInput} from "@mui/material";
import {ColorsMap, SxPropsMap} from "../../../type/common";

const SX: SxPropsMap = {
    chip: {width: '100%'},
    input: {height: '32px'},
}

type Props = {
    inputs: string[],
    colors?: ColorsMap,
    placeholder: string,
    editable: boolean,
    onChange: (values: string[]) => void,
}

export function DynamicInputs({ inputs, editable, placeholder, onChange, colors} : Props) {
    const colorsMap = colors ?? {}
    return (
        <Box display={"grid"} gridTemplateColumns={"repeat(auto-fill, 175px)"} gap={1}>
            {editable ? renderInputs() : renderChips()}
        </Box>
    )

    function renderInputs() {
        const nodesWithEmptyElement = inputs[inputs.length - 1] === '' ? inputs : [...inputs, '']
        return nodesWithEmptyElement.map((input, index) => {
            const color = colorsMap[input.toLowerCase()]
            return (
                <FormControl key={index} color={color} focused={!!color}>
                    <OutlinedInput
                        sx={SX.input}
                        type={"string"}
                        placeholder={`${placeholder} ${index}`}
                        size={"small"}
                        value={input}
                        onChange={(event) => handleChange(index, event.target.value)}
                   />
                </FormControl>
            )
        })
    }

    function renderChips() {
        return inputs.map((input, index) => (
            <Chip
                key={index}
                sx={SX.chip}
                color={colorsMap[input.toLowerCase()]}
                label={input ? input : `Instance ${index}`}
                disabled={!input}
                variant={"outlined"}
           />
        ))
    }

    function handleChange(index: number, value: string) {
        inputs[index] = value
        onChange(inputs.filter(node => !!node))
    }
}
