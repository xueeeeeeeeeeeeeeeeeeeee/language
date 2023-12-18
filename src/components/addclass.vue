<template>
  <a-form :model="formState" v-if="statechange == 1">
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
        v-if="item.dataIndex == 'QuestionContent'"
        name="file"
        :multiple="false"
        @change="handleChange"
        beforeUpload="false"
        accept=".jpg,.png,.mp4,.wav"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          上传文件
        </a-button>
      </a-upload>
      <a-input v-model:value="formState[item.dataIndex]" v-else />
    </a-form-item>
    <a-form-item>
      <label for="tag">标签绑定</label> <tag @handleInputConfirm="gettags"
    /></a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">确认</a-button>
      <a-button style="margin-left: 10px">取消</a-button>
    </a-form-item>
  </a-form>
  <a-form v-else>
    <a-form-item
      label="课程名称"
      style="display: flex; justify-content: center; align-items: center"
    >
      <a-input v-model:value="CourseName" />
    </a-form-item>
    <a-form-item
      label="开始时间"
      style="display: flex; justify-content: center; align-items: center"
    >
      <a-input v-model:value="StartTime" />
    </a-form-item>
    <a-form-item
      label="开课学院"
      style="display: flex; justify-content: center; align-items: center"
    >
      <a-input v-model:value="CollegeOfferingTheCourse" />
    </a-form-item>
    <a-form-item
      label="课程介绍"
      style="display: flex; justify-content: center; align-items: center"
    >
      <a-input v-model:value="CourseIntroduction" />
    </a-form-item>
    <a-upload
      class="fileinput"
      name="file"
      :multiple="false"
      @change="handleChange"
      beforeUpload="false"
      accept=".jpg,.png,.mp4,.wav"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        上传课程头像
      </a-button>
    </a-upload>
    <a-form-item>
      <label for="tag">标签绑定</label>
      <tag @handleInputConfirm="gettags"
    /></a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="createcourse">新建课程</a-button>
    </a-form-item>
  </a-form>
</template>
      <script setup>
import tag from "./tag.vue";
import { message } from "ant-design-vue";
import axios from "axios";
import { ref, onMounted, onUpdated } from "vue";
import { select } from "../js/axiosselect.js";
import { useRouter } from "vue-router";
const CourseName = ref("");
const StartTime = ref();
const CollegeOfferingTheCourse = ref();
const router = useRouter();
const props = defineProps({
  data: Array(),
  statechange: Number,
});
var formState = ref({
  ID: "",
  CreatedAt: "",
  FileID: "",
  UploaderID: "",
  FilePath: "",
  FileName: "",
  Language: "",
  Remarks: "",
});
const fileId = ref("上传文件成功 4xgeo1clla");
const columns = ref([]);
const filetype = ref("");
const CourseIntroduction = ref();
const tags=ref([]);
onUpdated(() => {
  console.log(localStorage.getItem("token"));
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: 6 };
  select(x).then((res) => {
    columns.value = res.col;
  });
  console.log(Object.entries(props.data));
  for (var i = 0; i < Object.entries(props.data).length; i++) {
    formState.value[Object.entries(props.data)[i][0]] = Object.entries(
      props.data
    )[i][1];
    console.log(formState.value);
  }
});
onMounted(() => {
  console.log(localStorage.getItem("token"));
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: 6 };
  select(x).then((res) => {
    columns.value = res.col;
  });
  console.log(Object.entries(props.data));
  for (var i = 0; i < Object.entries(props.data).length; i++) {
    formState.value[Object.entries(props.data)[i][0]] = Object.entries(
      props.data
    )[i][1];
    console.log(formState.value);
  }
});
const handleChange = (e) => {
  let formData = new FormData();
  formData.append("token", localStorage.getItem("token"));
  formData.append("file", e.file);
  formData.append("FileName", e.file.name);
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
      message.info("上传成功");
    }
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
const onSubmit = () => {};
const createcourse = () => {
  let formData = new FormData();
  formData.append("token", localStorage.getItem("token"));
  formData.append("CourseName", CourseName.value);
  formData.append("StartTime", StartTime.value);
  formData.append("CollegeOfferingTheCourse", CollegeOfferingTheCourse.value);
  formData.append("CourseIntroduction", CourseIntroduction.value);
  axios({
    method: "post",
    url: "/course/addcourse",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(function (response) {
    message.info(response.data.message);
  });
};
const gettags = (e) => {
  tags.value = e.slice(1);
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