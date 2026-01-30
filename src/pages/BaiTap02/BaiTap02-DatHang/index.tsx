import { useHistory } from "react-router";
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, Menu, Checkbox } from "antd";
import sanpham from "@/models/sanpham/sanpham";

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

function KhachHangBaiTap02() {



    const history = useHistory();

    const handleNavigate = () => {
        history.push('/bai-tap-02/Dat-Hang')
    }

    const handleBack = () => {
        history.push('/bai-tap-02')
    }
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

    //dat Hang
    const [listOrder, setListOrder] = useState<IOrderItem[]>([]);
    const handleOrder = (record: ISanPham, checked: boolean) => {
        if (checked) {
            setListOrder(prev => [
                ...prev,
                { ...record, quantity: 1 }
            ]);
        } else {
            setListOrder(prev =>
                prev.filter(item => item.id !== record.id)
            );
        }
    };
    const handleSubmit = () => {
        localStorage.setItem("order",
            JSON.stringify(listOrder)
        )
    }

    const handleQuantityChange = (id: number, value: number) => {

        setListOrder(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: value }
                    : item
            )
        );
    };

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
        }, {
            title: 'Đặt hàng',
            render: (_: any, record: ISanPham) => {
                return (
                    <>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <Checkbox
                                onChange={(e) => { handleOrder(record, e.target.checked) }}
                            ></Checkbox>
                            <Input placeholder="0" style={{ width: "30%", }} type="number"
                                onChange={(e) =>
                                    handleQuantityChange(
                                        record.id,
                                        Number(e.target.value)
                                    )
                                }
                            ></Input>
                        </div>
                    </>
                )
            }
        },
    ]

    return (
        <>
            <h1>Đặt Hàng</h1>
            <>
                <div style={{ marginBottom: "22px" }}>
                    <Menu>
                        <Menu.SubMenu key="SubMenu" title="Quản lí trang">
                            <Menu.Item key="three"
                                onClick={() => { handleBack() }}>
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
            <Table dataSource={originList} columns={colums} pagination={{
                pageSize: 5,
            }}></Table>
            <Popconfirm
                title="Bạn xác nhận đặt không?"
                onConfirm={() => { handleSubmit() }}
            >
                <Button type="primary">Xác nhận đặt hàng</Button>
            </Popconfirm>
        </ >
    );
}

export default KhachHangBaiTap02;