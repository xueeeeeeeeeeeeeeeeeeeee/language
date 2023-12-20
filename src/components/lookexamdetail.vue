<template>
  <a-drawer
    :placement="drawervalue"
    :closable="false"
    v-model:visible="visible"
    class="draweredit"
    :width="720"
  >
    <addexamTI :UnitID="nowUnitID"></addexamTI>
  </a-drawer>
  <div class="index">
    <div class="rightbody">
      <div class="index-mainbody">
        <a-button @click="imprtdata">导入题库</a-button>
        <a-button @click="exportdata">导出数据</a-button>
        <a-table
          id="tabledata"
          :row-selection="rowSelection"
          :columns="columns"
          :data-source="data"
          :pagination="{ pageSize: 4 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'tags'">
              <span>
                <a-tag v-for="tag in record.tags" :key="tag" :color="'green'">
                  {{ tag.toUpperCase() }}
                </a-tag>
              </span>
            </template>
          </template>
          <template #operation="{ column, record }">
            <div class="editable-rowtemplate-operations">
              <span>
                <a @click="edit(record)">删除</a>
              </span>
            </div>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>
  <script setup>
import addexamTI from "@/components/addexamTI";
import { cloneDeep } from "lodash-es";
import * as XLSX from "xlsx";
import { select } from "../js/axiosselect.js";
import axios from "axios";
import FileSaver from "file-saver";
import { useRouter } from "vue-router";
const drawervalue = ref("right");
const router = useRouter();
const state = ref("1");
const nowkey = ref("1");
const statechange = ref("0");
const selectcourseID = ref("");
import {
  reactive,
  ref,
  watch,
  computed,
  unref,
  onMounted,
  onUpdated,
  toRefs,
} from "vue";
const props = defineProps({
  UnitID: String,
});
const nowUnitID=ref("");
const indata = ref("");
const openKeys = ref(["sub1"]);
const visible = ref(false);
const editcol = ref([]);
const editableData = reactive({});
let { UnitID } = toRefs(props);
watch(UnitID, (val) => {
    nowUnitID.value=UnitID._object.UnitID;
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: 1 };
  select(x).then(async (res) => {
    if (res.data == "logout") {
    } else {
      columns.value = res.col;
      await findTi();
      for (var i = 0; i < data.value.length; i++) {
        data.value[i].key = i;
      }
    }
  });
  console.log(UnitID._object.UnitID);
});
const columns = ref([]);
const data = ref([]);
const token = ref("");
const selectedRowKeys = ref([]);
const onSelectChange = (changableRowKeys) => {
  selectedRowKeys.value = changableRowKeys;
};
onMounted(() => {
    nowUnitID.value=UnitID._object.UnitID;
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  var x = { key: 1 };
  select(x).then(async (res) => {
    if (res.data == "logout") {
    } else {
      columns.value = res.col;
      await findTi();
      for (var i = 0; i < data.value.length; i++) {
        data.value[i].key = i;
      }
    }
  });
  console.log(UnitID._object.UnitID);
});
const findTi = async () => {
  let res = Array();
  let formData = new FormData();
  formData.append("token", localStorage.getItem("token"));
  formData.append("UnitID", nowUnitID.value);
  await axios({
    method: "post",
    url: "/tiku/CheckBindTiWithExam",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(async function (response) {
    res = response.data.data.matched_idas;
    for (var i = 0; i < res.length; i++) {
      await selectTi(res[i]).then((reee) => {
        data.value.push(reee);
      });
    }
  });

  return res;
};
const selectTi = async (x) => {
  let res = Array();
  let formData = new FormData();
  formData.append("token", localStorage.getItem("token"));
  formData.append("QuestionID", x);
  formData.append("CheckType", "fuzzy");
  await axios({
    method: "post",
    url: "/tiku/GetQuestionsByParameters",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(function (response) {
    res = response.data.questions[0];
  });

  return res;
};
const edit = (key) => {};
const rowSelection = computed(() => {
  return {
    selectedRowKeys: unref(selectedRowKeys),
    onChange: onSelectChange,
    hideDefaultSelections: true,
    selections: [
      {
        key: "odd",
        text: "全选当页",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            return true;
          });
          selectedRowKeys.value = newSelectedRowKeys;
        },
      },
      {
        key: "odd",
        text: "反选当页",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            console.log(selectedRowKeys._rawValue);
            for (var i = 0; i < selectedRowKeys._rawValue.length; i++) {
              if (index == selectedRowKeys._rawValue[i]) {
                console.log("false");
                return false;
              }
            }

            return true;
          });
          selectedRowKeys.value = newSelectedRowKeys;
        },
      },
      {
        key: "odd",
        text: "清除当页",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            return false;
          });
          selectedRowKeys.value = newSelectedRowKeys;
        },
      },
      {
        key: "odd",
        text: "选择偶数",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          selectedRowKeys.value = newSelectedRowKeys;
        },
      },
      {
        key: "even",
        text: "选择奇数",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          selectedRowKeys.value = newSelectedRowKeys;
        },
      },
    ],
  };
});
const exportdata = () => {
  const exportArr = data.value;
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
const imprtdata = () => {
  visible.value = true;
};
const adddata = () => {
  visible.value = true;
  statechange.value = 0;
};
</script>
  <style>
.index {
  width: 100%;
  height: 100%;
  display: flex;
}
.leftnav {
  width: 20%;
  height: 100%;
  /* background-color: red; */
  border-right: #e4e7ed solid 2px;
}
.logo {
  width: 100%;
  height: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 900;
}
.rightbody {
  width: 80%;
  height: 100%;
}
.nav {
  width: 100%;
  height: 3em;
  background-color: aqua;
}
.index-mainbody {
  width: 100%;
  padding-top: 5%;
  padding-left: 5%;
  padding-right: 5%;
  padding-bottom: 5%;
  /* height: 100%; */
  /* background-color: rebeccapurple; */
}
.editable-row-operations a {
  margin-right: 8px;
}
</style>