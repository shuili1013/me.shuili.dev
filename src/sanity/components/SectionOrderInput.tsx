import { Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { set, type ArrayOfObjectsInputProps } from "sanity";
import { postSections, type PostSection } from "../types";

export const sectionTitles: Record<PostSection, string> = {
  cover: "封面圖",
  body: "內文",
  models: "3D 模型",
};

export const defaultSections = () =>
  postSections.map((kind) => ({ _type: "postSection", _key: kind, kind }));

const NoArrayFunctions = () => null;

// Reorder-only list: the three sections can be dragged but not added. Posts
// created before this field existed (or with a section removed) get a button
// that sets the default order; the site appends missing sections anyway.
export function SectionOrderInput(props: ArrayOfObjectsInputProps) {
  const value = (props.value ?? []) as { kind?: string }[];
  const complete =
    value.length === postSections.length &&
    postSections.every((kind) => value.some((item) => item.kind === kind));

  return (
    <Stack space={3}>
      {value.length > 0 &&
        props.renderDefault({ ...props, arrayFunctions: NoArrayFunctions })}
      {!complete && (
        <Card padding={3} radius={2} tone="caution" border>
          <Flex align="center" gap={3} wrap="wrap">
            <Text size={1}>
              {value.length === 0
                ? "這篇文章還沒設定順序，目前使用預設：封面圖 → 內文 → 3D 模型。"
                : "區塊不完整，網站會把缺少的區塊接在最後。"}
            </Text>
            <Button
              mode="ghost"
              text={value.length === 0 ? "使用預設順序並開始調整" : "重設為預設順序"}
              onClick={() => props.onChange(set(defaultSections()))}
            />
          </Flex>
        </Card>
      )}
    </Stack>
  );
}
