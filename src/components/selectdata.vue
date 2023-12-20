<template>
  <a-form :model="formState">
    <a-form-item :label="item.title" v-for="item in columns" :key="item">
      <a-textarea
        v-model:value="formState[item.dataIndex]"
        placeholder="textarea with clear icon"
        allow-clear
        v-if="item.dataIndex == 'QuestionContent'"
      />
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
</template>
      <script setup>
import { message } from "ant-design-vue";
import axios from "axios";
import { ref, onMounted, onUpdated, watch, toRefs, defineEmits } from "vue";
import { select } from "../js/axiosselect.js";
import { useRouter } from "vue-router";
const emits = defineEmits(["selectdata"]);
const router = useRouter();
const props = defineProps({
  data: String,
});
let { data } = toRefs(props);
watch(data, (val) => {
  init();
});
const init = async () => {
  console.log(data._object.data);
  console.log(Object.entries(data._object.data));
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: data._object.data, statechange: 3 };
  await select(x).then((res) => {
    columns.value = res.col;
  });
  for (var i = 0; i < Object.entries(data._object.data).length; i++) {
    if (data._object.statechange == 1) {
      formState.value[Object.entries(data._object.data)[i][0]] = Object.entries(
        data._object.data
      )[i][1];
    } else {
      formState.value[Object.entries(data._object.data)[i][0]] = "";
    }
  }
};
var formState = ref({});
const columns = ref([]);
onMounted(async () => {
  init();
});

const onSubmit = async () => {
  var getdata;
  if (data._object.data == 1) {
    await selectqusetion().then((res) => {
      getdata=res
    });
  } else if (data._object.data == 2) {
    await selectexam().then((res) => { getdata=res});
  } else if (data._object.data == 3) {
    await selectuser().then((res) => { getdata=res});
  } else if (data._object.data == 4) {
    await selectcourse().then((res) => { getdata=res});
  }
  emits("selectdata", getdata);
};
const selectqusetion = async () => {
  console.log(formState.value);
  let bigres = Array();
  let formData = new FormData();
  formData.append("token", localStorage.getItem("token"));
  if(formState.value.QuestionID!=null){  formData.append("QuestionID", formState.value.QuestionID);}
  if(formState.value.QuestionType!=null){    formData.append("QuestionType", formState.value.QuestionType);}
  if(formState.value.Language!=null){   formData.append("Language", formState.value.Language);}
  if(formState.value.QuestionContent!=null){      formData.append("QuestionContent", formState.value.QuestionContent);}
  if(formState.value.Options!=null){     formData.append("Options", formState.value.Options);}
  if(formState.value.Answer!=null){    formData.append("Answer", formState.value.Answer);}
  if(formState.value.Difficulty!=null){      formData.append("Difficulty", formState.value.Difficulty);}




  formData.append("CheckType", "fuzzy");
  // formData.append("CheckType", "all");
  await axios({
    method: "post",
    url: "/tiku/GetQuestionsByParameters",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(async function (response) {
    console.log(response);
    if (response.data.code != 200) {
      bigres = "logout";
    } else {
  bigres=response.data.questions;
    }
  });
  return bigres;
};
const selectexam = async () => {
  let bigres = Array();
    let formData = new FormData();
    formData.append("token", localStorage.getItem("token"));
  if(formState.value.UnitID!=null){  formData.append("UnitID", formState.value.UnitID);}
  if(formState.value.ValidityPeriod!=null){    formData.append("ValidityPeriod", formState.value.ValidityPeriod);}
  if(formState.value.QuestionBankSelection!=null){   formData.append("QuestionBankSelection", formState.value.QuestionBankSelection);}
  if(formState.value.TestNaming!=null){      formData.append("TestNaming", formState.value.TestNaming);}
  if(formState.value.AcademicYear!=null){     formData.append("AcademicYear", formState.value.AcademicYear);}
    await axios({
        method: "post",
        url: "/exam/GetExamByParameters",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then(async function (response) { // 声明为async函数
      console.log(response);
        if (response.data.code != 200) {
            bigres = "logout";
        } else {
            bigres = response.data.exams;
        }
    });

    return bigres;
};
const selectuser = async () => {};
const selectcourse = async () => {
  console.log(formState);
    let bigres = Array();
    let formData = new FormData();
    formData.append("token", localStorage.getItem("token"));
  if(formState.value.CourseName!=null){  formData.append("CourseName", formState.value.CourseName);}
  if(formState.value.TeacherID!=null){    formData.append("TeacherID", formState.value.TeacherID);}
  if(formState.value.StartTime!=null){   formData.append("StartTime", formState.value.StartTime);}
  if(formState.value.CollegeOfferingTheCourse!=null){      formData.append("CollegeOfferingTheCourse", formState.value.CollegeOfferingTheCourse);}
  if(formState.value.CourseID!=null){     formData.append("CourseID", formState.value.CourseID);}
    // formData.append("CheckType", "all");
    await axios({
        method: "post",
        url: "/course/getcoursebyparameters",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then(async function (response) {
      console.log(response);
        if (response.data.code != 200) {
            bigres = "logout";
        } else {
            bigres = response.data.data;
        }
    });
    return bigres;
}

const gettags = async (x) => {
    let res = Array();
    let formData = new FormData();
    formData.append("token", localStorage.getItem('token'));
    formData.append("Bindtype", x.Bindtype);
    formData.append("Ida", x.ida);
    await axios({
        method: "post",
        url: "/bind/getbindbytypeAndida",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then(function (response) {
        res = response.data.data.bindids;
    });

    return res;

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