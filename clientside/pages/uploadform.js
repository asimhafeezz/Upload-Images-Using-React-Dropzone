import {useState} from 'react'
import axios from 'axios'




export default () => {

    let [file, setfile] = useState([])
    let [storedfiles, setStoredfiles] = useState([])
    let [isuploaded , setisuploaded] = useState(false)
    let onSubmitHandler = e => {
        e.preventDefault()
        console.log(file)

        
        
        for (var i = 0; i < file.length; i++){

            let formdata = new FormData()
        formdata.append('image', file[i])

        axios({
            url: 'http://127.0.0.1:5000/upload',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            },
            data: formdata

        })
            .then((res) => {
                console.log(res.data)
                setisuploaded(true)
            })
        .catch(err => console.log(err))

}

    }

    let storeImages = e => {
        e.preventDefault()
        axios.get('http://127.0.0.1:5000/storedimages')
            .then(res => {
                setStoredfiles(res.data)
            })
    }

    return (
        <div>
            <form onSubmit={onSubmitHandler} method='post' encType="multipart/form-data">
                
                  <input type="file" name='files' multiple onChange={e => setfile(e.target.files)} />

                <button type='submit'>Upload file</button>

                {
                    isuploaded? <h5>File has been uploaded</h5>: null
                }
                
            </form>
            <div>
                <button onClick={storeImages}>Images Path in the database</button>
                <h3>Stored Images List</h3>

                {
                    
                    storedfiles.map(item => {
                        return (
                            <div>
                            <li key={item.id}>{item.imagepath}</li>
                                <img src={process.env.PUBLIC_URL , `${item.imagepath}`} style={{width:"100px" , height:'100px'}} alt='pics' />
                                </div>
                        )
                    })
                }
            </div>
        </div>
    )
}