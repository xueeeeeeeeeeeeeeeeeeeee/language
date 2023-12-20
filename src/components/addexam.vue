<template>
  <a-drawer
    :placement="drawervalue"
    :closable="false"
    v-model:visible="visible"
    class="draweredit"
    :width="720"
    ><lookexamdetail :UnitID="formState.UnitID"> </lookexamdetail
  ></a-drawer>
  <a-form :model="formState" v-if="statechange == 1">
    <a-form-item
      :label="item.title"
      v-for="(item, index) in columns.slice(0, 4)"
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
      <a-button type="primary" @click="lookTi">查看题库</a-button>
      <a-button type="primary" @click="onSubmit">确认</a-button>
      <a-button style="margin-left: 10px">取消</a-button>
    </a-form-item>
  </a-form>
  <a-form :model="formState" v-else>
    <a-form-item
      :label="item.title"
      v-for="(item, index) in columns.slice(0, 10)"
      :key="item"
    >
      <a-input v-model:value="formState[item.dataIndex]" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="oncreate">新建</a-button>
      <a-button style="margin-left: 10px">取消</a-button>
    </a-form-item>
  </a-form>
</template>
    <script setup>
import lookexamdetail from "./lookexamdetail.vue";
import { message } from "ant-design-vue";
import axios from "axios";
import { ref, onMounted, onUpdated, toRefs, watch } from "vue";
import { select } from "../js/axiosselect.js";
import { useRouter } from "vue-router";
const visible = ref(false);
const drawervalue = ref("right");
const router = useRouter();
const props = defineProps({
  data: Array(),
  statechange: Number,
});let { statechange } = toRefs(props);
let { data } = toRefs(props);
watch([data,statechange], (val) => {
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: 2, statechange: data._object.statechange };
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
onMounted(() => {
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: 2, statechange: data._object.statechange };
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
  formData.append("UnitID", formState.value.UnitID);
  formData.append("ValidityPeriod", formState.value.ValidityPeriod);
  formData.append("TestNaming", formState.value.TestNaming);
  formData.append("QuestionBankSelection", "xuyao");
  formData.append("AcademicYear", formState.value.AcademicYear);

  axios({
    method: "post",
    url: "/exam/EditExamUnit",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(function (response) {
    console.log(response);
    if(response.data.code==200){
      message.info("修改成功");
    }else{

       message.info("修改失败");}
  });
};
const oncreate = () => {
  let formData = new FormData();
  formData.append("token", localStorage.getItem("token"));
  formData.append("ValidityPeriod", formState.value.ValidityPeriod);
  formData.append("TestNaming", formState.value.TestNaming);
  formData.append("QuestionBankSelection", "xuyao");
  formData.append("AcademicYear", formState.value.AcademicYear);

  axios({
    method: "post",
    url: "/exam/AddExamUnit",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(function (response) {
    console.log(response);
    if(response.data.code==200){
      message.info("添加考试单元成功");
    }else{

       message.info("添加考试单元失败");}
  });
  console.log(formState.value);
};
const lookTi = () => {
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