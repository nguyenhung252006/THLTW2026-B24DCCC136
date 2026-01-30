import { Table, Button, Modal, Form, Input, Popconfirm, Menu } from "antd";
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router";
import sanpham from "@/models/sanpham/sanpham";
import { raw } from "express";



//interface san pham
interface ISanPham {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

interface IOrderItem extends ISanPham {
    quantity: number;
}



//modal filter
const ModalFilter = ({ onFilter }: any) => {

    const [name, setName] = useState("");
    const [min, setMin] = useState<number | null>(null);
    const [max, setMax] = useState<number | null>(null);

    useEffect(() => {
        onFilter(name, min, max);
    }, [name, min, max]);

    return (
        <>
            <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
                <Input
                    placeholder="Lọc theo tên"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <Input
                    placeholder="Giá thấp nhất"
                    type="number"
                    value={min ?? ""}
                    onChange={e => setMin(e.target.value ? Number(e.target.value) : null)}
                />
                <Input
                    placeholder="Giá cao nhất"
                    type="number"
                    value={max ?? ""}
                    onChange={e => setMax(e.target.value ? Number(e.target.value) : null)}
                />
            </div>
        </>
    )
}

//modal fix
const ModalShowFix = ({ isModalOpen, setIsModalOpen, productEdit, onFinish }: any) => {

    const [form] = Form.useForm();


    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (productEdit) {
            form.setFieldsValue({
                name: productEdit.name,
                category: productEdit.category,
                price: productEdit.price,
                quantity: productEdit.quantity,
            })
        }
    }, [productEdit])

    return (
        <>
            <Modal title="Basic Modal" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form

                    onFinish={onFinish}
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tên sản phẩm"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Loại sản phẩm"
                        name="category"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Giá sản phẩm"
                        name="price"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Số lượng"
                        name="quantity"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

function BaiTap02() {

    //state update
    const [originList, setOriginList] = useState<ISanPham[]>(
        sanpham.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: item.quantity,
        }))
    );


    const [listSanPham, setListSanPham] = useState<ISanPham[]>(originList);

    const [productEdit, setProductEdit] = useState<ISanPham | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idSp, setIdSp] = useState<number>(0);
    const handleOnFinish = (values: Omit<ISanPham, "id">) => {
        setListSanPham(prev =>
            prev.map(item => item.id == idSp ? { ...item, ...values } : item)
        )
        setIsModalOpen(false)
    }

    //handle delete
    const handleDelete = (id: number): void => {
        const newData = originList.filter(item => item.id !== id)
        setOriginList(newData)
        setListSanPham(newData)
    }


    //ModalFilter
    const handleFilter = (
        name: string,
        min: number | null,
        max: number | null
    ) => {
        let result = [...originList];

        // lọc theo tên
        if (name.trim()) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(name.toLowerCase())
            );
        }

        // lọc giá thấp nhất
        if (min !== null) {
            result = result.filter(item => item.price >= min);
        }

        // lọc giá cao nhất
        if (max !== null) {
            result = result.filter(item => item.price <= max);
        }

        setListSanPham(result);
    };



    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            sorter: (a: any, b: any) => a.id - b.id,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Loại sản phẩm',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        }, {
            title: 'Thao tác',
            render: (_: any, record: ISanPham) => {
                return (
                    <>
                        <div>
                            <Button style={{ marginRight: "30px" }}
                                onClick={() => {
                                    setIsModalOpen(true)
                                    setProductEdit(record)
                                    setIdSp(record.id)
                                }}
                            >
                                Sửa
                            </Button>
                            <Popconfirm
                                title="Bạn có chắc chắn muốn xóa"
                                onConfirm={() => { handleDelete(record.id) }}
                            >
                                <Button type="primary">Xóa</Button>
                            </Popconfirm>
                        </div>
                    </>
                )
            }
        },
    ]

    const history = useHistory();

    const handleNavigate = () => {
        history.push('/bai-tap-02/Dat-Hang')
    }

    //lay don Hang
    const dataOrder = localStorage.getItem("order")
    const listOrder: IOrderItem[] = dataOrder ? JSON.parse(dataOrder) : []
    const [isOpenOrder, setIsOpenModal] = useState<boolean>(false)

    const ModalOrder = () => {

        const dataSource: IOrderItem[] = listOrder.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: item.quantity
        }));

        const colums = [
            {
                title: 'STT',
                dataIndex: 'id',
                key: 'id',
                sorter: (a: any, b: any) => a.id - b.id,
            },
            {
                title: 'Tên sản phẩm',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Loại sản phẩm',
                dataIndex: 'category',
                key: 'category',
            },
            {
                title: 'Giá',
                dataIndex: 'price',
                key: 'price',
            },
            {
                title: 'Số lượng',
                dataIndex: 'quantity',
                key: 'quantity',
            },
        ]


        return (
            <>
                <Button type="primary" onClick={() => { setIsOpenModal(true) }}>
                    Xem đơn hàng
                </Button>
                <Modal title="Đơn đặt hàng" visible={(isOpenOrder)} onOk={() => { setIsOpenModal(false) }} onCancel={() => { setIsOpenModal(false) }}>
                    <Table pagination={{
                        pageSize: 5,
                    }} dataSource={dataSource} columns={colums} />
                    <Button type="primary"
                        onClick={() => {
                            localStorage.removeItem("order")
                            setIsOpenModal(false)
                        }}
                    >Xác nhận đơn</Button>
                </Modal>
            </>
        )
    }

    return (
        <>
            <h1>Bài tập 02</h1>
            <>
                <div style={{ marginBottom: "22px" }}>
                    <Menu>
                        <Menu.SubMenu key="SubMenu" title="Quản lí trang">
                            <Menu.Item key="three">
                                Trang Quản Lý
                            </Menu.Item>
                            <Menu.Item key="three"
                                onClick={() => { handleNavigate() }}
                            >
                                Đặt Hàng
                            </Menu.Item>
                        </Menu.SubMenu>
                    </Menu >
                </div>
            </>
            <ModalFilter
                onFilter={handleFilter}
            />
            <Table
                dataSource={listSanPham} columns={columns}
                rowKey="id"
                pagination={{
                    pageSize: 5,
                }}
            >

            </Table>
            <ModalShowFix
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                onFinish={handleOnFinish}
                productEdit={productEdit}
            />
            <ModalOrder />
        </>
    );
}

export default BaiTap02;