import { Button, Modal, Checkbox, Radio, Input, Table, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';

interface ExamItem {
    key: number;
    name: string;
    khoiKienThuc: string;
    mucDo: string[];
    soCau: string | number;
}

const QuanLyDeThi: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [exams, setExams] = useState<ExamItem[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [khoiKienThucValue, setKhoiKienThucValue] = useState<string>('Tổng quan');
    const [mucDoValue, setMucDoValue] = useState<string[]>([]);
    const [soCau, setSoCau] = useState<string | number>('');

    const KhoiKienThuc = [
        { label: 'Tổng quan', value: 'Tổng quan' },
        { label: 'Chuyên sâu', value: 'Chuyên sâu' },
    ];

    const MucDo = [
        { label: 'Dễ', value: 'Dễ' },
        { label: 'Trung bình', value: 'Trung bình' },
        { label: 'Khó', value: 'Khó' },
        { label: 'Rất khó', value: 'Rất khó' },
    ];

    const showModal = (record: ExamItem | null = null) => {
        if (record) {
            setEditingId(record.key);
            setKhoiKienThucValue(record.khoiKienThuc);
            setMucDoValue(record.mucDo);
            setSoCau(record.soCau);
        } else {
            setEditingId(null);
            setKhoiKienThucValue('Tổng quan');
            setMucDoValue([]);
            setSoCau('');
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!soCau) {
            alert("Vui lòng nhập số câu!");
            return;
        }

        let newExams: ExamItem[];

        if (editingId !== null) {
            newExams = exams.map(item =>
                item.key === editingId
                    ? { ...item, khoiKienThuc: khoiKienThucValue, mucDo: mucDoValue, soCau: soCau }
                    : item
            );
        } else {
            const newExam: ExamItem = {
                key: Date.now(),
                name: `Đề thi số ${exams.length + 1}`,
                khoiKienThuc: khoiKienThucValue,
                mucDo: mucDoValue,
                soCau: soCau
            };
            newExams = [...exams, newExam];
        }

        setExams(newExams);
        localStorage.setItem('saved_exams', JSON.stringify(newExams));
        setIsModalOpen(false);
    };

    const handleDelete = (key: number) => {
        const filteredExams = exams.filter(item => item.key !== key);
        setExams(filteredExams);
        localStorage.setItem('saved_exams', JSON.stringify(filteredExams));
    };

    const handleLoadData = () => {
        const saved = localStorage.getItem('saved_exams');
        if (saved) {
            setExams(JSON.parse(saved));
        }
    };

    React.useEffect(() => {
        handleLoadData();
    }, []);

    const columns: ColumnsType<ExamItem> = [
        { title: 'Tên đề', dataIndex: 'name', key: 'name' },
        { title: 'Kiến thức', dataIndex: 'khoiKienThuc', key: 'khoiKienThuc' },
        {
            title: 'Mức độ',
            dataIndex: 'mucDo',
            key: 'mucDo',
            render: (tags: string[]) => (
                <>
                    {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
                </>
            )
        },
        { title: 'Số câu', dataIndex: 'soCau', key: 'soCau' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)}>Sửa</Button>
                    <Button danger onClick={() => handleDelete(record.key)}>Xóa</Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Quản lý đề thi</h1>
            <Button type="primary" onClick={() => showModal()} style={{ marginBottom: '20px' }}>
                Tạo đề thi mới
            </Button>

            <Table columns={columns} dataSource={exams} pagination={{ pageSize: 5 }} />

            <Modal
                title={editingId ? "Chỉnh sửa đề thi" : "Cấu trúc đề thi"}
                visible={isModalOpen}
                onOk={handleSave}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu cấu trúc"
                cancelText="Hủy"
                destroyOnClose
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <p style={{ fontWeight: 'bold' }}>Khối kiến thức:</p>
                        <Radio.Group
                            options={KhoiKienThuc}
                            value={khoiKienThucValue}
                            onChange={(e) => setKhoiKienThucValue(e.target.value)}
                        />
                    </div>
                    <div>
                        <p style={{ fontWeight: 'bold' }}>Mức độ:</p>
                        <Checkbox.Group
                            options={MucDo}
                            value={mucDoValue}
                            onChange={(checkedValues) => setMucDoValue(checkedValues as string[])}
                        />
                    </div>
                    <div>
                        <p style={{ fontWeight: 'bold' }}>Số lượng câu hỏi:</p>
                        <Input
                            placeholder='Nhập số câu'
                            style={{ width: "100%" }}
                            type='number'
                            value={soCau}
                            onChange={(e) => setSoCau(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default QuanLyDeThi;