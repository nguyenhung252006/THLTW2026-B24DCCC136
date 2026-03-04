import { Table, Modal, Button, Input, Popconfirm } from "antd";
import { useState, useEffect } from "react";


interface Data {
    key: number;
    name: string;
    date: string;
    time: string;
    studied: number;
    content: string;
    note: string;
}

function TienDoHocTap() {

    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [content, setContent] = useState("")
    const [note, setNote] = useState("")

    const [isEditing, setIsEditing] = useState(false);
    const [editingKey, setEditingKey] = useState<number | null>(null);

    const [data, setData] = useState<Data[]>(() => {
        const stored = localStorage.getItem("data");
        return stored ? JSON.parse(stored) : [];
    });

    const columnsTienDo = [
        {
            title: 'Tên môn học',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Thời lượng cần học',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Tiến độ học (phút)',
            render: (_: any, record: Data) => (
                <Input
                    style={{ width: "30%" }}
                    type="number"
                    value={record.studied}
                    onChange={(e) => handleChangeTienDo(record.key, Number(e.target.value))}
                />
            )
        },
        {
            title: 'Trạng thái',
            render: (_: any, record: Data) => {
                return Number(record.studied) >= Number(record.time)
                    ? <span style={{ color: "green", fontWeight: 600 }}>Hoàn thành</span>
                    : <span style={{ color: "red", fontWeight: 600 }}>Chưa hoàn thành</span>
            }
        }
    ]


    const columns = [
        {
            title: 'Tên môn học',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Thời gian học',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Thời lượng học',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Nội dung đã học',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Thao tác',
            render: (_, record: Data) => (
                <>
                    <Popconfirm
                        title="Xóa môn học"
                        onConfirm={() => handleDelete(record.key)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger style={{ marginRight: 8 }}>
                            Xóa
                        </Button>
                    </Popconfirm>

                    <Button
                        type="primary"
                        onClick={() => handleEdit(record)}
                    >
                        Chỉnh sửa
                    </Button>
                </>
            )
        }
    ];

    //handle them mon hoc
    const handleAdd = () => {
        const newItem = {
            key: Date.now(),
            name,
            date,
            time,
            studied: 0,
            content,
            note
        };

        setData(prev => [...prev, newItem]);

        setName("");
        setDate("");
        setTime("");
        setContent("");
        setNote("");
        setIsModal(false)
    }

    //handle xoa
    const handleDelete = (key: number) => {
        const newData = data.filter(item => item.key !== key);
        setData(newData);
    };

    //handle edit 
    const resetForm = () => {
        setName("");
        setDate("");
        setTime("");
        setContent("");
        setNote("");
        setEditingKey(null);
        setIsEditing(false);
        setIsModal(false);
    };

    const handleEdit = (record: Data) => {
        setIsModal(true);
        setIsEditing(true);
        setEditingKey(record.key);

        setName(record.name);
        setDate(record.date);
        setTime(record.time);
        setContent(record.content);
        setNote(record.note);
    };
    const handleUpdate = () => {
        const updatedData = data.map(item =>
            item.key === editingKey
                ? { ...item, name, date, time, content, note }
                : item
        );

        setData(updatedData);
        resetForm();
    };

    //handle tien do
    const handleChangeTienDo = (key: number, value: number) => {
        const updatedData = data.map(item =>
            item.key === key
                ? { ...item, studied: value }
                : item
        );

        setData(updatedData);
    };

    //modal add 
    const [isModal, setIsModal] = useState(false)

    useEffect(() => {
        localStorage.setItem("data", JSON.stringify(data));
    }, [data]);
    return (

        <>
            <h1>Theo dõi tiến độ học tập</h1>
            <div
                style={{ margin: "0 20px 20px 0" }}
            >
                <Button
                    type="primary"
                    onClick={() => {
                        setIsEditing(false);
                        setIsModal(true);
                    }}
                >
                    Thêm môn học
                </Button>
                <Modal
                    title={isEditing ? "Chỉnh sửa môn học" : "Thêm môn học"}
                    visible={isModal}
                    onOk={isEditing ? handleUpdate : handleAdd}
                    onCancel={resetForm}
                >
                    <span style={{ fontWeight: 600 }}>Tên môn học</span>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tên môn học"
                    />
                    <br /><br />

                    <span style={{ fontWeight: 600 }}>Thời gian học</span>
                    <Input
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        type="date"
                    />
                    <br /><br />

                    <span style={{ fontWeight: 600 }}>Thời lượng học</span>
                    <Input
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                    <br /><br />

                    <span style={{ fontWeight: 600 }}>Nội dung đã học</span>
                    <Input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <br /><br />

                    <span style={{ fontWeight: 600 }}>Ghi chú</span>
                    <Input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </Modal>
            </div>
            <div>
                <Table
                    columns={columns}
                    dataSource={data}
                />
            </div>
            <br></br>
            <h1>Bảng theo dõi tiến độ</h1>
            <br />
            <Table columns={columnsTienDo} dataSource={data} />
        </>

    );
}

export default TienDoHocTap;