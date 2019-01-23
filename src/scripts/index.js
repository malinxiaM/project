
//请求豆瓣接口
$.ajax("http://localhost:8888/proxydouban/v2/movie/top250")
.then((res)=>{
    console.log(res)
})

class Foo{
    constructor(){
        this.a = 10;
    }
}
new Foo();


