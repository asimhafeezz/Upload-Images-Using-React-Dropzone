import { useState, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IconButton , Button} from "@material-ui/core";

//icons
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CancelIcon from "@material-ui/icons/Cancel";

import axios from 'axios'

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "50px 0px 50px 0px",
    borderWidth: 2,
  margin:'7%',
  borderRadius: 25,
  borderColor: "",
  borderStyle: "dotted",
  backgroundColor: "#ffffff",
  outline: "none",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
  boxShadow: ' inset 6px 6px 31px #666666, inset -6px -6px 31px #ffffff'
};

const activeStyle = {
  borderColor: "#2196f3"
};

const acceptStyle = {
  borderColor: "#00e676"
};

const rejectStyle = {
  borderColor: "#ff1744"
};

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16
};

const thumb = {
  position: "relative",
  display: "inline-flex",
  borderRadius: 4,
  marginBottom: 8,
  marginRight: 8,
  width: "auto",
  height: 135,
  padding: 4
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden"
};

const img = {
  width: "auto",
  height: "100%"
};

let centerStyle= {display:'flex' , justifyContent:'center' , fontWeight:'bold'}

export default props => {

  const [files, setFiles] = useState([]);
  let [storedfiles , setstoredfiles] = useState([])

  const onDrop = acceptedFiles => {
    setFiles(
      acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    )
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isDragRejected,
    acceptedFiles
  } = useDropzone({
    accept: "image/*",
    maxSize: "2097152",
    onDrop
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject]
  );

  const thumbs = files.map((item, index) => (
    <div style={thumb} key={item.name}>
      <div style={thumbInner}>
        <img src={item.preview} style={img} />
      </div>

      <div style={{ position: "absolute", float: "right" }}>
        <IconButton
          style={{ outline: "none", color: "black" }}
          onClick={() => {
            const newList = [...files];
            newList.splice(index, 1);
            setFiles(newList);
          }}
        >
          <CancelIcon />
        </IconButton>
      </div>
    </div>
  ));


  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

//storing an image to server
  let onSubmitHandler = e => {
    e.preventDefault()
    console.log(files)
    for (var i = 0; i < files.length; i++){

        let formdata = new FormData()
    formdata.append('image', files[i])

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
  

//getting all images path from database
let storeImages = e => {
    e.preventDefault()
    axios.get('http://127.0.0.1:5000/storedimages')
        .then(res => {
            setstoredfiles(res.data)
        })
}


  return (
      <div className="container">
          <h3 style={centerStyle}>Upload Multiple Images</h3>
     <form onSubmit={onSubmitHandler} method='post' encType="multipart/form-data">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <div style={{ paddingBottom: "1rem" }}>
          <CloudUploadIcon style={{ fontSize: "7rem" }} size="large" />
        </div>

        {isDragActive ? (
          
          isDragReject ? <p>Only Images are allowed</p> : <p>Drop the Photo here ...</p>
        ) : (
          <p className="small">Drag 'n' Drop Vehicale Photos <br /> max-size = 2MB</p>
          )}
       
          </div>
          <div  style={{ marginLeft: '7%', marginRight:'7%'}}>
              <aside style={thumbsContainer}>{thumbs}</aside>
              <div style={centerStyle}>
              <Button type="submit" variant="contained" color="primary" style={{marginTop:'1rem'}} >Upload Images</Button>
              </div>
        </div>
      </form>
      
      {/* displaying images dynamically */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', flexDirection:'column'}}>
                <Button variant="contained" color="primary" onClick={storeImages}>Images Path in the database</Button>
                <h3>Stored Images List</h3>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' , flexWrap:'wrap'}}>
                {
                    
                    storedfiles.map(item => {
                        return (
                            <div style={{flex:1 , flexGrow:1 , margin:'1rem'}}>
                            {/* <li key={item.id}>{item.imagepath}</li> */}
                                <img src={process.env.PUBLIC_URL , `${item.imagepath}`} style={{width:"100px" , height:'100px'}} alt='pics' />
                                </div>
                        )
                    })
                }
            </div>
            </div>
    </div>
  );
};

