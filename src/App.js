import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Button, Table } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';




function App() {

  const [product, setproduct] = useState([])
  const [addData, setaddData] = useState({
    name: "",
    price: "",
  })
  const [editData, seteditData] = useState({
    name: "",
    price: "",
  })
  const [indexEdit, setindexEdit] = useState(-1)
  const [indexDelete, setindexDelete] = useState(-1)
  const [modalOpen, setmodalOpen] = useState(false)
  const [modalEditOpen, setmodalEditOpen] = useState(false)

  useEffect(()=> {
    const fetchData = async() => {
      try {
        const res = await axios.get('http://localhost:5000/products')
        setproduct(res.data)
        // console.log(product)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  },[])

  
  const deleteData = async (id) => {
    try {
      let res = await axios.delete(`http://localhost:5000/products/${id}`)
      setproduct(res.data)
      setindexDelete(-1)
      setmodalOpen(false)
    } catch (error) {
      console.log(error)
    }
  }
  const openDeleteModal = (index) => {
    setindexDelete(index)
    setmodalOpen(true)
  }
  const deleteModal = () => {
    return (
      <div>
        <Modal isOpen={modalOpen} toggle={() => setmodalEditOpen(!modalOpen)}>
          <ModalHeader>Delete Data</ModalHeader>
          <ModalBody>
            Are you sure delete {product[indexDelete]?.name}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => deleteData(product[indexDelete]?.id)}>Yes! Delete</Button>
            <Button color="primary" onClick={() => setmodalOpen(!modalOpen)}>No! Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
  const openEditModal = (index) => {
    setindexEdit(index)
    seteditData(product[index])
    setmodalEditOpen(true)
  }
  const onInputEditChange = (e) => {
    seteditData({...editData,[e.target.name]:e.target.value})
  }
  const onEditClick = async(id) => {
    const dataEdit = {
      name: editData.name,
      price: editData.price
    }
    try {
      let res = await axios.patch(`http://localhost:5000/products/${id}`, dataEdit)
      setproduct(res.data)
      setindexEdit(-1)
      setmodalEditOpen(false)
      seteditData({
        name: "",
        price: "",
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  const EditModal = () => {
    if (indexEdit >= 0){
      return (
        <div>
          <Modal isOpen={modalEditOpen} toggle={() => setmodalOpen(!modalEditOpen)}>
            <ModalHeader>Edit Data</ModalHeader>
            <ModalBody>
              <Input value={editData.name} onChange={onInputEditChange} name="name"  placeholder="Enter a Name" />
              <Input value={editData.price} onChange={onInputEditChange} className='mt-4' name="price"  placeholder="Enter a Price" />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => onEditClick(product[indexEdit]?.id)}>Yes! Edit</Button>
              <Button color="primary" onClick={() => setmodalEditOpen(!modalEditOpen)}>No! Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      )
    }return null
  }
  const rowRend = () => {
    return product.map ((val, index) => {
      return (
        <tr key={index}>
          <th scope="row" >{index +1 }</th>
          <td>{val.name}</td>
          <td>{val.price}</td>
          <Button onClick={() => openDeleteModal(index)}>Delete</Button>
          <Button className='ml-4' onClick={() => openEditModal(index)}>Edit</Button>
        </tr>
      )
    })
  }

  const onInputChange = (e) => {
    setaddData({...addData,[e.target.name]:e.target.value})
  }
  const addDataClick = async() => {
    const DatatoBe = addData
    try {
      let res = await axios.post(`http://localhost:5000/products`, DatatoBe)
      setproduct(res.data)
      setaddData({
        name: "",
        price: "",
      })
    } catch (error) {
      console.log(error)
    }
  }
  const renderTable = () => {
    return (
      <Table>
      <thead>
        <tr>
          <th>Nomor</th>
          <th>Nama</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {rowRend()}
      </tbody>
      <tfoot>
          <td></td>
          <td>
            <input
              placeholder="product name"
              className="form-control"
              name="name"
              value={addData.name}
              onChange={onInputChange}
            />
          </td>
          <td>
            <input
              placeholder="price"
              className="form-control"
              name="price"
              value={addData.price}
              onChange={onInputChange}
            />
          </td>
          <td>
            <button className="btn btn-success" onClick={addDataClick} >
              Add Data
            </button>
          </td>
        </tfoot>
    </Table>
    )
  }
  return (
    <div className='container'>
      {deleteModal()}
      {renderTable()}
      {EditModal()}
    </div>
  );
}

export default App;
