<template>
  <a-drawer
    :closable="false"
    v-model:visible="visible"
    class="draweredit"
    :width="720"
  >
    <lookcourseunit v-if="lookvue == 1" :CourseID="courseID"></lookcourseunit>
    <lookcoursestudent
      v-if="lookvue == 2"
      :CourseID="courseID"
    ></lookcoursestudent>
    <lookcourseexam v-if="lookvue == 3" :courseID="courseID"></lookcourseexam>
  </a-drawer>
  <a-form :model="formState" v-if="statechange == 1">
    <a-button type="primary" @click="lookstudent">查看学生</a-button>
    <a-button type="primary" @click="lookunit">查看课程小节</a-button>
    <a-button type="primary" @click="lookexam">查看课程考试</a-button>
    <a-form-item
      :label="item.title"
      v-for="(item, index) in columns.slice(0, 6)"
      :key="item"
    >
      <a-input v-model:value="formState[item.dataIndex]" />
    </a-form-item>
    <a-form-item>
      <label for="tag">标签绑定</label>
      <tag @handleInputConfirm="gettags" :data="tags"
    /></a-form-item>
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
        上传文件
      </a-button>
    </a-upload>
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
        上传文件
      </a-button>
    </a-upload>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="oncreate">新建</a-button>
      <a-button style="margin-left: 10px">取消</a-button>
    </a-form-item>
  </a-form>
</template>
  <script setup>
import lookcoursestudent from "@/components/lookcoursestudent";
import lookcourseunit from "@/components/lookcourseunit";
import lookcourseexam from "@/components/lookcourseexam";
import tag from "./tag.vue";
import { message } from "ant-design-vue";
import axios from "axios";
import { ref, onMounted, onUpdated, toRefs, watch } from "vue";
import { select } from "../js/axiosselect.js";
import { useRouter } from "vue-router";
const courseID = ref("");
const visible = ref(false);
const lookvue = ref("0");
const router = useRouter();
const props = defineProps({
  data: Array(),
  statechange: Number,
});
let { data } = toRefs(props);
let { statechange } = toRefs(props);
watch([statechange, data], (val) => {
  courseID.value = data._object.data.CourseID;
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: 4, statechange: data._object.statechange };
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
const imgurl = ref("");
const fileId = ref("");
const columns = ref([]);
const filetype = ref("");
onMounted(() => {
  courseID.value = data._object.data.CourseID;
  console.log(data._object.data.CourseID);
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: 4, statechange: data._object.statechange };
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
      formState.value.ImageUrl = response.data.url;
      console.log(imgurl.value);
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
  formData.append("CourseID", formState.value.CourseID);
  formData.append("CourseName", formState.value.CourseName);
  formData.append("StartTime", formState.value.StartTime);
  formData.append(
    "CollegeOfferingTheCourse",
    formState.value.CollegeOfferingTheCourse
  );
  formData.append("CourseIntroduction", formState.value.CourseIntroduction);
  formData.append("ImageUrl", formState.value.ImageUrl);
  axios({
    method: "post",
    url: "/course/editcourse",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(function (response) {
    console.log(response);
    if (response.data.message == "无权限编辑该课程") {
      message.info("无权限编辑该课程");
    } else {
      message.info("编辑课程信息成功");
    }
  });  for (var i = 0; i < tags.value.length; i++) {
    let formData2 = new FormData();
    console.log(tags.value[i]);
    formData2.append("token", localStorage.getItem("token"));
    formData2.append("CourseID", formState.value.CourseID);
    formData2.append("TagID", tags.value[i]);
    axios({
      method: "post",
      url: "/course/bindcoursewithtag",
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
  formData.append("CourseName", formState.value.CourseName);
  formData.append("StartTime", formState.value.StartTime);
  formData.append(
    "CollegeOfferingTheCourse",
    formState.value.CollegeOfferingTheCourse
  );
  formData.append("CourseIntroduction", formState.value.CourseIntroduction);
  formData.append("ImageUrl", imgurl.value);
  axios({
    method: "post",
    url: "/course/addcourse",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(function (response) {
    console.log(response);
    if (response.data.code == 200) {
      message.info("插入课程信息成功");
    } else {
      message.info(response.data.message);
    }
  });
  console.log(formState.value);
  console.log(tags.value);
};
const lookunit = () => {
  lookvue.value = 1;
  visible.value = true;
};
const lookstudent = () => {
  lookvue.value = 2;
  visible.value = true;
};
const lookexam = () => {
  lookvue.value = 3;
  visible.value = true;
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