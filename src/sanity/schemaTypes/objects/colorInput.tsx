import { Box, Flex, Stack, Text, TextInput } from "@sanity/ui";
import type { StringInputProps } from "sanity";
import { defineField, type TextRule } from "@sanity/types";
import { set } from "sanity";

const toColorPickerValue = (value: string) => {
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
    return value;
  }

  if (/^#[0-9A-Fa-f]{3}$/.test(value)) {
    const [r, g, b] = value.slice(1);
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return "#000000";
};

function HexColorInput(props: StringInputProps) {
  const { value = "", onChange } = props;
  const pickerValue = toColorPickerValue(value);

  return (
    <Stack space={3}>
      <Flex align="center" gap={3}>
        <Box>
          <input
            type="color"
            value={pickerValue}
            onChange={(event) => onChange(set(event.currentTarget.value))}
            aria-label="Pick a color"
            style={{
              width: "3rem",
              height: "3rem",
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          />
        </Box>
        <Flex align="center" gap={2} flex={1}>
          <TextInput
            value={value}
            onChange={(event) => onChange(set(event.currentTarget.value))}
          />
        </Flex>
      </Flex>
      <Text muted size={1}>
        Pick a color visually or type a hex value like #111111.
      </Text>
    </Stack>
  );
}

export default defineField({
  name: "colorInput",
  type: "string",
  components: {
    input: HexColorInput,
  },
  validation: (Rule: TextRule) =>
    Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
      name: "hex color",
      invert: false,
    }).error("Entrez une couleur hexadécimale valide"),
});
