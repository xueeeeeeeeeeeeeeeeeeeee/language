<template>
  <a-form :model="formState" v-if="statechange == '1'">
    <a-form-item
      :label="item.title"
      v-for="(item, index) in columns.slice(0, 10)"
      :key="item"
    >
      <a-textarea
        v-model:value="formState[item.dataIndex]"
        placeholder="textarea with clear icon"
        allow-clear
        v-if="item.dataIndex == 'QuestionContent'"
      />
      <a-upload
        class="fileinput"
        name="file"
        :multiple="false"
        @change="handleChange"
        beforeUpload="false"
        accept=".jpg,.png,.mp4,.wav"
        v-if="item.dataIndex == 'QuestionContent'"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          上传文件
        </a-button>
      </a-upload>
      <a-select
        v-model:value="formState.QuestionType"
        style="width: 200px"
        :options="options"
        v-else-if="item.dataIndex == 'QuestionType'"
      ></a-select>
      <a-input v-model:value="formState[item.dataIndex]" v-else />
    </a-form-item>
    <a-form-item>
      <label for="tag">标签绑定</label>
      <tag @handleInputConfirm="gettags" :data="tags"
    /></a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">确认</a-button>
      <a-button style="margin-left: 10px">取消</a-button>
    </a-form-item>
  </a-form>
  <a-form :model="formState" v-else>
    <a-form-item
      :label="item.title"
      v-for="(item, index) in columns"
      :key="item"
    >
      <a-input v-model:value="formState[item.dataIndex]" />
    </a-form-item>
    <a-form-item>
      <label for="tag">标签绑定</label>
      <tag @handleInputConfirm="gettags" :data="tags"
    /></a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="oncreate">新建</a-button>
      <a-button style="margin-left: 10px">取消</a-button>
    </a-form-item>
  </a-form>
</template>
  <script setup>
import tag from "./tag.vue";
import { message } from "ant-design-vue";
import axios from "axios";
import { ref, onMounted, onUpdated, toRefs, watch } from "vue";
import { select } from "../js/axiosselect.js";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  statechange: String,
  data: Array(),
});
let { data } = toRefs(props);
let { statechange } = toRefs(props);
watch([statechange, data], (val) => {
  init();
});
const init = () => {
  statechange.value = data._object.statechange;
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: 1, statechange: data._object.statechange };
  select(x).then((res) => {
    columns.value = res.col;
  });
  console.log(data._object.statechange);
  for (var i = 0; i < Object.entries(data._object.data).length; i++) {
    if (data._object.statechange == 1) {
      formState.value[Object.entries(data._object.data)[i][0]] = Object.entries(
        data._object.data
      )[i][1];
    } else {
      formState.value[Object.entries(data._object.data)[i][0]] = "";
    }
  }

  tags.value = formState.value.tags;
  console.log(tags.value);
};
var formState = ref({
  QuestionID: "",
  QuestionType: "",
  Language: "",
  QuestionContent: "",
  Options: "",
  Answer: "",
  AcademicYear: "",
  Difficulty: "",
  CreatedBy: "",
  Remarks: "",
});
const tags = ref([]);
const options = ref([
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
const fileId = ref("");
const columns = ref([]);
const filetype = ref("");

onMounted(() => {
  statechange.value = data._object.statechange;
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: 1, statechange: data._object.statechange };
  select(x).then((res) => {
    columns.value = res.col;
  });
  console.log(data._object.statechange);
  for (var i = 0; i < Object.entries(data._object.data).length; i++) {
    if (data._object.statechange == 1) {
      formState.value[Object.entries(data._object.data)[i][0]] = Object.entries(
        data._object.data
      )[i][1];
    } else {
      formState.value[Object.entries(data._object.data)[i][0]] = "";
    }
  }

  tags.value = formState.value.tags;
  console.log(tags.value);
});
const handleChange = (e) => {
  console.log(e.file);
  filetype.value = e.file.type;

  let formData = new FormData();
  formData.append("token", localStorage.getItem("token"));
  formData.append("file", e.file);
  formData.append("Language", "汉语");
  formData.append("FileName", e.file.name);
  console.log(formData);
  axios({
    method: "post",
    url: "/file/upload",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(function (response) {
    console.log(response);
    if (response.data.message == "文件已经存在") {
      message.info("文件已经存在");
    } else {
      fileId.value = response.data.message.substring(7);
      getfile();
    }

    // notice.value = response.data.data;
    // console.log(notice.value);
  });
};
const gettags = (e) => {
  tags.value = e.slice(1);
  console.log(tags.value);
};
const getfile = () => {
  let formData = new FormData();
  formData.append("token", localStorage.getItem("token"));
  formData.append("FileID", fileId.value);
  axios({
    method: "post",
    url: "/file/geturlbyfileid",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(function (response) {
    if (response.data.code == 200) {
      if (filetype.value == "image/jpg" || filetype.value == "image/png") {
        formState.value.QuestionContent =
          formState.value.QuestionContent +
          "<image src='" +
          response.data.url +
          "'/>";
      } else {
        formState.value.QuestionContent =
          formState.value.QuestionContent +
          "<video src='" +
          response.data.url +
          "'/>";
      }
      console.log(response.data.url);
    } else {
      message.info("上传失败");
    }
    // notice.value = response.data.data;
    // console.log(notice.value);
  });
};
const onSubmit = () => {
  let formData = new FormData();
 
  formData.append("token", localStorage.getItem("token"));
  formData.append("AcademicYear", formState.value.AcademicYear);
  formData.append("QuestionID", formState.value.QuestionID);
  formData.append("QuestionType", formState.value.QuestionType);
  formData.append("Language", formState.value.Language);
  formData.append("QuestionContent", formState.value.QuestionContent);
  formData.append("Options", formState.value.Options);
  formData.append("Answer", formState.value.Answer);
  formData.append("Difficulty", formState.value.Difficulty);
  formData.append("Remarks", formState.value.Remarks);
  formData.append("AnswerType", formState.value.AnswerType);
  axios({
    method: "post",
    url: "/tiku/EditQuestionInformation",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(function (response) {
    console.log(response);
    if (response.data.message == "无权限编辑该题目") {
      message.info("无权限编辑该题目");
    } else if (response.data.message == "编辑题目信息成功") {
      message.info("编辑题目信息成功");
    } else {
      message.info(response.data.message);
    }
  });
  for (var i = 0; i < tags.value.length; i++) {
    let formData2 = new FormData();
    console.log(tags.value[i]);
    formData2.append("token", localStorage.getItem("token"));
    formData2.append("QuestionID", formState.value.QuestionID);
    formData2.append("TagID", tags.value[i]);
    axios({
      method: "post",
      url: "/tiku/BindTiToTag",
      data: formData2,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(function (response) {
      console.log(response);
    });
  }
};
const oncreate = () => {
  let formData = new FormData();
  formData.append("token", localStorage.getItem("token"));
  formData.append("AcademicYear", formState.value.AcademicYear);
  formData.append("QuestionType", formState.value.QuestionType);
  formData.append("Language", formState.value.Language);
  formData.append("QuestionContent", formState.value.QuestionContent);
  formData.append("Options", formState.value.Options);
  formData.append("Answer", formState.value.Answer);
  formData.append("Difficulty", formState.value.Difficulty);
  formData.append("Remarks", formState.value.Remarks);
  formData.append("AnswerType", formState.value.AnswerType);
  axios({
    method: "post",
    url: "/tiku/AddQuestionInformation",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(function (response) {
    console.log(response);
    if (response.data.message == "无权限编辑该题目") {
      message.info("无权限编辑该题目");
    } else if (response.data.message == "增加题目信息成功") {
      message.info("增加题目信息成功");
    } else {
      message.info(response.data.message);
    }
  });
  console.log(formState.value);
  console.log(tags.value);
};
</script>
<style scoped>
::v-deep .fileinput .css-dev-only-do-not-override-eq3tly {
  margin-top: 30px;
}
.fileinput {
  margin-top: 30px;
}
</style>