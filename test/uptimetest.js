let array = []

array.push(
    {
        "제목": setInterval(() => {
            console.log("test")
        }, 1000)
    }
)
console.log(array)

setTimeout(() => {
    clearInterval(array[0])
}, 4000);