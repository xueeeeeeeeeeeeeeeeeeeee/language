<template>
    <a-form :model="formState" v-if="statechange == '1'">
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

        <a-input v-model:value="formState[item.dataIndex]" v-else />
        <label   v-if="item.dataIndex == 'QuestionBankSelection'">不同题目之间请用逗号隔开</label>
      </a-form-item>

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
        <label   v-if="item.dataIndex == 'QuestionBankSelection'">不同题目之间请用逗号隔开</label>
      </a-form-item>
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
  CourseID:String,
  });
  const nowCourseID=ref("");
  let { CourseID } = toRefs(props);
  let { data } = toRefs(props);
  let{statechange}=toRefs(props);
  watch([statechange,data,CourseID], (val) => {
    init();
  });
  const init=()=>{
    nowCourseID.value=CourseID._object.CourseID;
    statechange.value= data._object.statechange;
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
    var x = { key: 41, statechange: data._object.statechange };
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
  }
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
init();
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
    formData.append("SectionID", formState.value.SectionID);
    formData.append("SectionName", formState.value.SectionName);
    formData.append("QuestionBankSelection", formState.value.QuestionBankSelection);
    formData.append("HierarchyDirectoryNumber", formState.value.HierarchyDirectoryNumber);

    axios({
      method: "post",
      url: "/courseunit/editcourseunit",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(function (response) {
      console.log(response);
      if (response.data.message == "无权限编辑该题目") {
        message.info("无权限编辑该题目");
      } else if(response.data.message == "编辑题目信息成功") {
        message.info("编辑题目信息成功");
      }else{
        message.info(response.data.message);
      }
    });
  };
  const oncreate = () => {
    let formData = new FormData();
    formData.append("token", localStorage.getItem("token"));
    formData.append("SectionName", formState.value.SectionName);
    formData.append("HierarchyDirectoryNumber", formState.value.HierarchyDirectoryNumber);
    formData.append("QuestionBankSelection", formState.value.QuestionBankSelection);
    axios({
      method: "post",
      url: "/courseunit/addcourseunit",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(async function (response) {
        console.log(response);
await bind(response.data.data.section_id);
    });
    console.log(formState.value);
    console.log(tags.value);
  };
  const bind=(x)=>{
    let formData = new FormData();
    formData.append("token", localStorage.getItem("token"));
    formData.append("SectionID", x);
    formData.append("CourseID", nowCourseID.value);
    axios({
      method: "post",
      url: "/courseunit/bindxiaoJiewithcourse",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(function (response) {
      console.log(response);
        message.info(response.data.message);
      
    });
    console.log(formState.value);
    console.log(tags.value);
  }
  
  </script>
  <style scoped>
  ::v-deep .fileinput .css-dev-only-do-not-override-eq3tly {
    margin-top: 30px;
  }
  .fileinput {
    margin-top: 30px;
  }
  </style>