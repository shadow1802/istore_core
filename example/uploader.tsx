// this file use for react js
const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const { file } = form.elements as typeof form.elements & {
        file: { files: FileList }
    }

    // for mutiple uploader:
    const multiple_uploader_data = new FormData()
    for (let x = 0; x < file.files.length; x++) {
        multiple_uploader_data.append("files", file.files[x])
    }
    const multiple_uploader = await fetch("http://localhost:8888/upload/multiple", {
        method: "POST", headers: {
        }, body: multiple_uploader_data
    })
    // ---------------------->

    // for single uploader:
    const single_uploader_data = new FormData()
    single_uploader_data.append("file", file.files[0])
    const single_uploader = await fetch("http://localhost:8888/upload/single", {
        method: "POST", headers: {
        }, body: single_uploader_data
    })
    // ---------------------->

    const multiple_response = await multiple_uploader.json()
    const single_response = await single_uploader.json()
    console.log(multiple_response, single_response)
}

const getData = async () => {
    const res = await fetch("http://localhost:8888/user/search?keyword=tung")
    const data = await res.json()
    console.log(data)
}