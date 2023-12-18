import axios from 'axios';
import {
    useRouter
} from 'vue-router';
const router = useRouter();
async function select(e) {
    let response = {
        data: [],
        col: []
    };

    if (e.key == 1) {
        await QuestionsByParameters().then(res => {
            response.data = res;

        })
    } else if (e.key == 5) {
        await getfilelist().then(res => {
            response.data = res;

        })
    } else if (e.key == 4) {
        await getcourse().then(res => {
            response.data = res;

        })
    } else if (e.key == 2) {
        await getexam().then(res => {
            response.data = res;

        })
    }

    await axios.get('http://localhost:8080/tables.json').then(res => {
        if (e.key == 1) {
            response.col = res.data.Question;
        } else if (e.key == 5) {
            response.col = res.data.file;
        } else if (e.key == 4) {
            response.col = res.data.course;
        }else if (e.key == 2) {
            response.col = res.data.exams;
        }
    })
    return response;

};
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
const QuestionsByParameters = async () => {
    let bigres = Array();
    let formData = new FormData();
    formData.append("token", localStorage.getItem('token'));
    formData.append("CheckType", "all");
    await axios({
        method: "post",
        url: "/tiku/GetQuestionsByParameters",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then(async function (response) { // 声明为async函数
        if (response.data.code != 200) {
            bigres = "logout";
        } else {
            for (var i = 0; i < response.data.questions.length; i++) {
                var obj = {
                    ida: null,
                    Bindtype: null
                };
                obj.ida = response.data.questions[i].QuestionID;
                obj.Bindtype = "BindTiWithTag";
                await gettags(obj).then(
                    res => {
                        var x = response.data.questions[i];
                        x.tags = res;
                        bigres.push(x);
                    }
                );



            }
        }
    });

    return bigres;
};


const getfilelist = async () => {
    let res;
    let formData = new FormData();
    formData.append("token", localStorage.getItem('token'));
    // formData.append("CheckType", "all");
    await axios({
        method: "post",
        url: "/file/getfilelist",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then(function (response) {
        if (response.data.code != 200) {
            res = "logout";
        } else {
            res = response.data.filelist;
            for (var i = 0; i < response.data.filelist.length; i++) {
                if (response.data.filelist[i].FileType == ".png" || response.data.filelist[i].FileType == ".jpg") {
                    res[i].import = "<image src='" + response.data.filelist[i].FilePath + "'>";
                } else if (response.data.filelist[i].FileType == ".wav" || response.data.filelist[i].FileType == ".mp4") {
                    res[i].import = "<video src='" + response.data.filelist[i].FilePath + "'>";
                }
            }

        }


        // notice.value = response.data.data;
        // console.log(notice.value);
    });
    return res;
};
const getcourse = async () => {
    let bigres = Array();
    let formData = new FormData();
    formData.append("token", localStorage.getItem('token'));
    // formData.append("CheckType", "all");
    await axios({
        method: "post",
        url: "/course/getmyteachcourseid",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then(async function (response) {
        if (response.data.code != 200) {
            res = "logout";
        } else {
            for (var i = 0; i < response.data.data.course_ids.length; i++) {
                await getcourseinfo(response.data.data.course_ids[i]).then(
                    res => {
                        bigres.push(res);
                    }
                );
            }
        }


        // notice.value = response.data.data;
        // console.log(notice.value);
    });
    return bigres;
}
const getcourseinfo = async (CourseID) => {
    let bigres;
    let formData = new FormData();
    formData.append("token", localStorage.getItem('token'));
    formData.append("CourseID", CourseID);
    // formData.append("CheckType", "all");
    await axios({
        method: "post",
        url: "/course/getcoursebyparameters",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then(async function (response) {
        if (response.data.code != 200) {
            bigres = "logout";
        } else {
            bigres = response.data.data[0];
            var obj = {
                ida: response.data.data[0].CourseID,
                Bindtype: "BindTagWithCourse"
            };
            await gettags(obj).then(
                res => {
                    bigres.tags = res;
                }
            );
        }


        // notice.value = response.data.data;
        // console.log(notice.value);
    });
    return bigres;
}
const getexam=async()=>{
    let bigres = Array();
    let formData = new FormData();
    formData.append("token", localStorage.getItem('token'));
    formData.append("UnitID", "%");
    await axios({
        method: "post",
        url: "/exam/GetExamByParameters",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then(async function (response) { // 声明为async函数
        if (response.data.code != 200) {
            bigres = "logout";
        } else {
bigres=response.data.exams;
        }
    });

    return bigres;
}
export {
    select
}