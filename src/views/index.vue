<template>
  <a-drawer
    :placement="drawervalue"
    :closable="false"
    v-model:visible="visible"
    class="draweredit"
    :width="720"

  >
    <addquestion :data="indata" v-if="state == '1'"></addquestion>
    <addfile
      v-if="state == '55'"
      :data="indata"
      :statechange="statechange"
    ></addfile>
    <addclass
      v-if="state == '44'"
      :data="indata"
      :statechange="statechange"
    ></addclass>
    <lookcourse></lookcourse>
  </a-drawer>
  <div class="index">
    <div class="leftnav">
      <div class="logo">汉语小程序-教师端</div>
      <a-menu
        id="dddddd"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        style="width: 100%"
        mode="inline"
        :items="items"
        @click="handleClick"
      ></a-menu>
    </div>
    <div class="rightbody">
      <div class="nav"></div>
      <div class="index-mainbody">
        <a-button @click="adddata">新建</a-button>
        <a-button @click="imprtdata">导入数据</a-button>
        <a-button @click="exportdata">导出数据</a-button>
        <a-table
          id="tabledata"
          :row-selection="rowSelection"
          :columns="columns"
          :data-source="data"
          :pagination="{ pageSize: 7 }"
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
                <a @click="edit(record)">编辑</a>
              </span>
            </div>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script setup>
import addclass from "../components/addclass.vue";
import lookcourse from "@/components/lookcourse.vue";
import addquestion from "../components/addquestion.vue";
import addfile from "../components/addfile.vue";
import { cloneDeep } from "lodash-es";
import * as XLSX from "xlsx";
import { select } from "../js/axiosselect.js";
import axios from "axios";
import FileSaver from "file-saver";
import { useRouter } from "vue-router";
const drawervalue=ref("right");
const router = useRouter();
const state = ref("1");
const nowkey = ref("1");
const statechange = ref("0");
import {
  reactive,
  ref,
  watch,
  computed,
  unref,
  onMounted,
  defineComponent,
} from "vue";
const indata = ref("");
import { Table } from "ant-design-vue";
import addquestionVue from "@/components/addquestion.vue";
const selectedKeys = ref(["1"]);
const openKeys = ref(["sub1"]);
const visible = ref(false);
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const editcol = ref([]);
const editableData = reactive({});
const items = reactive([
  getItem("题库筛选", "1"),
  getItem("测试管理", "2"),
  getItem("学籍管理", "3"),
  getItem("课程管理", "4"),
  getItem("资源管理", "5"),
]);
const handleClick = (e) => {
  nowkey.value = e.key;
  select(e).then((res) => {
    console.log(res);
    if (res.data == "logout") {
      router.push("/login");
    }
    columns.value = res.col;
    data.value = res.data;
    for (var i = 0; i < res.col.length - 1; i++) {
      editcol.value.push(res.col[i].dataIndex);
    }
  });
};
watch(openKeys, (val) => {});
const columns = ref([
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
]);
const data = ref([]);
const token = ref("");
const selectedRowKeys = ref([]);
const onSelectChange = (changableRowKeys) => {
  selectedRowKeys.value = changableRowKeys;
};
onMounted(() => {
  if (!localStorage.getItem("token")) {
  }
  var x = { key: 1 };
  select(x).then((res) => {
    if (res.data == "logout") {
      router.push("/login");
    } else {
      columns.value = res.col;
      data.value = res.data;

      for (var i = 0; i < res.col.length - 1; i++) {
        editcol.value.push(res.col[i].dataIndex);
      }
    }

    console.log(res);
  });
});
const edit = (key) => {
  if (nowkey.value == 1) {
    state.value = "1";
  }else if(nowkey.value==4){
    drawervalue.value="bottom";
    state.value = "4";
  }

  console.log(key);
  indata.value = key;
  editableData[key] = cloneDeep(
    data.value.filter((item) => key === item.key)[0]
  );
  console.log(data.value);
  visible.value = true;
};
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
const imprtdata = () => {};
const adddata = () => {
  if (nowkey.value == 5) {
    console.log(nowkey.value);
    state.value = "55";
    console.log(state.value);
    visible.value = true;
  } else if (nowkey.value == 4) {
    console.log(nowkey.value);
    state.value = "44";
    console.log(state.value);
    visible.value = true;
  }
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