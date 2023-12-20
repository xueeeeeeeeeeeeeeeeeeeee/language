<template>
  <a-form :model="formState" v-if="statechange == 1">
    <a-form-item
      :label="item.title"
      v-for="(item, index) in columns.slice(0, 8)"
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
        v-if="item.dataIndex == 'QuestionContent'"
        name="file"
        :multiple="false"
        @change="handleChange"
        accept=".jpg,.png,.mp4,.wav"
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
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">确认</a-button>
      <a-button style="margin-left: 10px">取消</a-button>
    </a-form-item>
  </a-form>
  <a-form :model="student" v-else>
    <a-form-item :label="item.title" v-for="item in columns" :key="item">
      <a-input v-model:value="formState[item.dataIndex]"
    /></a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="oncreate">确认</a-button>
      <a-button style="margin-left: 10px">取消</a-button>
    </a-form-item>
  </a-form>
</template>
    <script setup>
import { message } from "ant-design-vue";
import axios from "axios";
import { ref, onMounted, onUpdated, watch, toRefs } from "vue";
import { select } from "../js/axiosselect.js";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  data: Array(),
  statechange: Number,
});
let { statechange } = toRefs(props);
let { data } = toRefs(props);
watch([data, statechange], async (val) => {
  console.log(Object.entries(data._object.data));
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: 3, statechange: data._object.statechange };
  await select(x).then((res) => {
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
});
var formState = ref({});
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
onMounted(async () => {
  console.log(data);
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: 3, statechange: data._object.statechange };
  await select(x).then((res) => {
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
});
const handleChange = (e) => {
  filetype.value = e.file.type;

  let formData = new FormData();
  formData.append("token", localStorage.getItem("token"));
  formData.append("file", e.file);
  formData.append("Language", "汉语");
  formData.append("FileName", e.file.name);
  axios({
    method: "post",
    url: "/file/upload",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(function (response) {
    console.log(response.data.message);
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
          "'>";
      } else {
        formState.value.QuestionContent =
          formState.value.QuestionContent +
          "<video src='" +
          response.data.url +
          "'>";
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
    } else {
      message.info("编辑题目信息成功");
    }
  });
};
const oncreate = () => {
  if (formData.value.IDcode.length != 14) {
    message.info("学号必须是14位");
  } else {
    let formData = new FormData();
    formData.append("IDcode", formState.value.IDcode);
    formData.append("Class", formState.value.Class);
    formData.append("Name", formState.value.Name);
    formData.append("PasswordHash", formState.value.PasswordHash);
    formData.append("Nationality", formState.value.Nationality);
    formData.append("Age", formState.value.Age);
    formData.append(
      "LearningDurationBeforeEnrollment",
      formState.value.LearningDurationBeforeEnrollment
    );
    formData.append("Gender", formState.value.Gender);
    formData.append("Grade", formState.value.Grade);
    formData.append("College", formState.value.College);
    formData.append("AdministrativeClass", formState.value.AdministrativeClass);
    axios({
      method: "post",
      url: "/account/register",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(function (response) {
      console.log(response);
      if (response.data.message == "注册成功") {
        message.info("注册成功");
      } else if (response.data.message == "该统一身份认证用户存在") {
        message.info("该统一身份认证用户存在");
      } else {
        message.info("缺少字段");
      }
    });
    console.log(formState.value);
  }
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