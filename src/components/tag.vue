<template>
  <template v-for="(tag, index) in state.tags" :key="tag">
    <a-tooltip v-if="tag.length > 20" :title="tag">
      <a-tag :closable="index !== 0" @close="handleClose(tag)">
        {{ `${tag.slice(0, 20)}...` }}
      </a-tag>
    </a-tooltip>
    <a-tag v-else :closable="index !== 0" @close="handleClose(tag)">
      {{ tag }}
    </a-tag>
  </template>

  <a-select
    v-model:value="addtag"
    style="width: 200px"
    :options="options"
    v-if="state.inputVisible"
    @change="handleInputConfirm"
  ></a-select>
  <a-tag
    v-else
    @click="showInput"
    style="background: #fff; border-style: dashed"
  >
    New Tag
  </a-tag>
</template>
  <script setup>
import {
  defineComponent,
  ref,
  reactive,
  defineEmits,
  nextTick,
  onMounted,
  onUpdated
} from "vue";
const emits = defineEmits();
const options = reactive([
  {
    value: "多选题",
    label: "多选题",
  },
  {
    value: "单选题",
    label: "单选题",
  },
  {
    value: "填空题",
    label: "填空题",
  },
  {
    value: "演说题",
    label: "演说题",
  },
  {
    value: "写字题",
    label: "写字题",
  },
]);
const addtag = ref();
const inputRef = ref();
const state = reactive({
  tags: ["标签选择"],
  inputVisible: false,
  inputValue: "",
});
const props = defineProps({
  data: Array(),
});
onUpdated(()=>{
  state.tags=["标签选择"];
  if (props.data!=null) {
    state.tags = state.tags.concat(props.data);
  }

  console.log(props.data);
})
onMounted(() => {
  state.tags=["标签选择"];
  if (props.data!=null) {
    state.tags = state.tags.concat(props.data);
  }

  console.log(props.data);
});
const handleClose = (removedTag) => {
  const tags = state.tags.filter((tag) => tag !== removedTag);
  emits("handleInputConfirm", tags);
  state.tags = tags;
};
const showInput = () => {
  state.inputVisible = true;
};
const handleInputConfirm = () => {
  const inputValue = addtag.value;
  let tags = state.tags;
  if (inputValue && tags.indexOf(inputValue) === -1) {
    tags = [...tags, inputValue];
  }
  emits("handleInputConfirm", tags);
  Object.assign(state, {
    tags,
    inputVisible: false,
    inputValue: "",
  });
};
</script>