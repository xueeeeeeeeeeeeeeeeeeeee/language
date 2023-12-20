<template>
  <a-button type="primary" @click="pull">下载模板</a-button>
  <a-upload
    class="fileinput"
    name="file"
    :multiple="false"
    @change="handleChange"
    beforeUpload="false"
    accept=".xlsx"
  >
    <a-button>
      <upload-outlined></upload-outlined>
      上传文件
    </a-button>
  </a-upload>
  <a-button type="primary" @click="onload">上传</a-button>
</template>
    <script setup>
import lookcoursestudent from "@/components/lookcoursestudent";
import lookcourseunit from "@/components/lookcourseunit";
import lookcourseexam from "@/components/lookcourseexam";
import tag from "./tag.vue";
import { message } from "ant-design-vue";
import axios from "axios";
import * as XLSX from "xlsx";
import { ref, onMounted, onUpdated, toRefs, watch } from "vue";
import { select } from "../js/axiosselect.js";
import { useRouter } from "vue-router";
const courseID = ref("");
const visible = ref(false);
const lookvue = ref("0");
const router = useRouter();
const props = defineProps({
  data: String,
});
let { data } = toRefs(props);
watch(data, (val) => {
  init();
});
var formState = ref({});
const init = () => {
  getnewxlsxdata.value.length = 0;
  console.log(data._object.data);
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: data._object.data, statechange: 3 };
  select(x).then((res) => {
    columns.value = res.col;
    console.log(columns.value);
    var x = {};
    for (var i = 0; i < columns.value.length; i++) {
      x[columns.value.dataIndex] = "";
    }
    ondata.value.push(x);
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
  tags.value = formState.value.tags;
};
const getxlsxdata = ref();
const getnewxlsxdata = ref([]);
const tags = ref([]);
const imgurl = ref("");
const fileId = ref("");
const columns = ref([]);
const ondata = ref([]);
onMounted(() => {
  init();
});
const pull = () => {
  const exportArr = ondata.value;
  const Header = [];
  const head = [];
  for (var i = 0; i < columns.value.length; i++) {
    head.push(columns.value[i].title);
  }
  Header.push(head);
  console.log(Header);
  // 官方文档中的描述：converts an array of arrays of JS data to a worksheet.
  const headerWs = XLSX.utils.aoa_to_sheet(Header);
  const ws = XLSX.utils.sheet_add_json(headerWs, exportArr, {
    skipHeader: true,
    origin: "A2",
  });

  /* 新建空workbook，然后加入worksheet */
  const wb = XLSX.utils.book_new();

  // 可以自定义下载之后的sheetname
  XLSX.utils.book_append_sheet(wb, ws, "sheetName");

  /* 生成xlsx文件 */
  XLSX.writeFile(wb, "下载.xlsx");
};
const handleChange = async (e) => {
  let reader = new FileReader();
  reader.readAsBinaryString(e.file);
  await file2Xce(e.file).then(() => {
    for (var i = 0; i < getxlsxdata.value.length; i++) {
      var x = {};
      console.log(getnewxlsxdata.value);
      for (var j = 0; j < columns.value.length; j++) {
        x[columns.value[j].dataIndex] =
          getxlsxdata.value[i][columns.value[j].title];
      }
      getnewxlsxdata.value.push(x);
    }
  });
};
const file2Xce = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      // 二进制流方式读取得到整份Excel表格对象
      const excelData = XLSX.read(data, {
        type: "binary",
      });
      // console.log('exvelData', this.excelData);
      // 只取第一个工作表
      const wsname = excelData.SheetNames[0]; // 取第一张表
      const ws = XLSX.utils.sheet_to_json(excelData.Sheets[wsname]); // 生成json表格内容
      resolve(ws);
      getxlsxdata.value = ws;
    };

    // 以二进制方式打开文件
    reader.readAsBinaryString(file); //file.raw取上传文件的File
  });
};
const onload = () => {
  if (data._object.data == 1) {
    onloadquestion();
  } else if (data._object.data == 3) {
    onloaduser();
  }
};
const onloadquestion = () => {
  for (var i = 0; i < getnewxlsxdata.value.length; i++) {
    let formData = new FormData();
    formData.append("token", localStorage.getItem("token"));
    formData.append("AcademicYear", getnewxlsxdata.value.AcademicYear);
    formData.append("QuestionType", getnewxlsxdata.value.QuestionType);
    formData.append("Language", getnewxlsxdata.value.Language);
    formData.append("QuestionContent", getnewxlsxdata.value.QuestionContent);
    formData.append("Options", getnewxlsxdata.value.Options);
    formData.append("Answer", getnewxlsxdata.value.Answer);
    formData.append("Difficulty", getnewxlsxdata.value.Difficulty);
    formData.append("Remarks", getnewxlsxdata.value.Remarks);
    formData.append("AnswerType", getnewxlsxdata.value.AnswerType);
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
  }
};
const onloaduser = () => {
  for (var i = 0; i < getnewxlsxdata.value.length; i++) {
    let formData = new FormData();
    formData.append("IDcode", getnewxlsxdata.value.IDcode);
    formData.append("Class", getnewxlsxdata.value.Class);
    formData.append("Name", getnewxlsxdata.value.Name);
    formData.append("PasswordHash", getnewxlsxdata.value.PasswordHash);
    formData.append("Nationality", getnewxlsxdata.value.Nationality);
    formData.append("Age", getnewxlsxdata.value.Age);
    formData.append(
      "LearningDurationBeforeEnrollment",
      getnewxlsxdata.value.LearningDurationBeforeEnrollment
    );
    formData.append("Gender", getnewxlsxdata.value.Gender);
    formData.append("Grade", getnewxlsxdata.value.Grade);
    formData.append("College", getnewxlsxdata.value.College);
    formData.append(
      "AdministrativeClass",
      getnewxlsxdata.value.AdministrativeClass
    );
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