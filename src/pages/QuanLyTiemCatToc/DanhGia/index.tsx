import React, { useState, useEffect } from 'react';
import {
    List, Rate, Avatar, Button, Input,
    Space, Card, Tag, Typography, Modal, Form, Statistic, Row, Col, Empty, message, Select
} from 'antd';
import { MessageOutlined, StarFilled, UserOutlined, ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { TextArea } = Input;

const DanhGia: React.FC = () => {
    const [formReview] = Form.useForm();
    const [formReply] = Form.useForm();
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
    const [selectedReview, setSelectedReview] = useState<any>(null);

    const [employees, setEmployees] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>(() => {
        const saved = localStorage.getItem('danhSachDanhGia');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const savedStaff = localStorage.getItem('danhSachNhanVien');
        if (savedStaff) setEmployees(JSON.parse(savedStaff));
    }, []);

    useEffect(() => {
        localStorage.setItem('danhSachDanhGia', JSON.stringify(reviews));
    }, [reviews]);


    const getAverageRate = (employeeName: string) => {
        const staffReviews = reviews.filter(r => r.employeeName === employeeName);
        if (staffReviews.length === 0) return 0;
        const sum = staffReviews.reduce((acc, curr) => acc + curr.rating, 0);
        return (sum / staffReviews.length).toFixed(1);
    };


    const handleAddReview = () => {
        formReview.validateFields().then((values) => {
            const newReview = {
                id: Date.now().toString(),
                customerName: values.customerName,
                employeeName: values.employeeName,
                rating: values.rating,
                content: values.content,
                date: new Date().toLocaleString(),
                reply: null,
            };
            setReviews([newReview, ...reviews]);
            setIsReviewModalVisible(false);
            formReview.resetFields();
            message.success('Đã thêm đánh giá mới!');
        });
    };

    const handleReply = () => {
        formReply.validateFields().then((values) => {
            const updated = reviews.map(r =>
                r.id === selectedReview.id ? { ...r, reply: values.reply } : r
            );
            setReviews(updated);
            setIsReplyModalVisible(false);
            formReply.resetFields();
            message.success('Đã phản hồi đánh giá!');
        });
    };

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Button type="link" href="/quan-ly-tiem-cat-toc" icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>Về trang chủ</Button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Đánh giá & Phản hồi</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsReviewModalVisible(true)}
                >
                    Viết đánh giá mới
                </Button>
            </div>

            <Card title="Xếp hạng nhân viên" style={{ marginBottom: 24 }}>
                <Row gutter={16}>
                    {employees.map(emp => (
                        <Col span={6} key={emp.key}>
                            <Statistic
                                title={emp.name}
                                value={getAverageRate(emp.name)}
                                prefix={<StarFilled style={{ color: '#fadb14' }} />}
                                suffix="/ 5"
                            />
                        </Col>
                    ))}
                    {employees.length === 0 && <Text type="secondary">Vui lòng thêm nhân viên trước</Text>}
                </Row>
            </Card>

            <Card title="Lịch sử đánh giá">
                <List
                    itemLayout="vertical"
                    dataSource={reviews}
                    renderItem={(item) => (
                        <List.Item
                            key={item.id}
                            actions={[
                                <Button type="link" icon={<MessageOutlined />} onClick={() => { setSelectedReview(item); setIsReplyModalVisible(true); }}>
                                    {item.reply ? 'Sửa phản hồi' : 'Phản hồi'}
                                </Button>
                            ]}
                            extra={<Text type="secondary">{item.date}</Text>}
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                title={<Text strong>{item.customerName} → <Tag color="blue">{item.employeeName}</Tag></Text>}
                                description={<Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} />}
                            />
                            <p>{item.content}</p>
                            {item.reply && (
                                <div style={{ padding: '12px', background: '#f9f9f9', borderLeft: '4px solid #1890ff', borderRadius: '4px' }}>
                                    <Text strong>Cửa hàng: </Text>
                                    <Text>{item.reply}</Text>
                                </div>
                            )}
                        </List.Item>
                    )}
                    locale={{ emptyText: <Empty description="Chưa có đánh giá nào" /> }}
                />
            </Card>

            <Modal
                title="Viết đánh giá mới"
                visible={isReviewModalVisible}
                onOk={handleAddReview}
                onCancel={() => setIsReviewModalVisible(false)}
                okText="Gửi đánh giá"
            >
                <Form form={formReview} layout="vertical">
                    <Form.Item name="customerName" label="Tên của bạn" rules={[{ required: true }]}>
                        <Input placeholder="Nhập tên khách hàng..." />
                    </Form.Item>

                    <Form.Item name="employeeName" label="Đánh giá nhân viên nào?" rules={[{ required: true }]}>
                        <Select placeholder="Chọn nhân viên">
                            {employees.map(emp => (
                                <Select.Option key={emp.key} value={emp.name}>{emp.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="rating" label="Số sao" rules={[{ required: true }]} initialValue={5}>
                        <Rate />
                    </Form.Item>

                    <Form.Item name="content" label="Nội dung nhận xét" rules={[{ required: true }]}>
                        <TextArea rows={3} placeholder="Dịch vụ rất tuyệt vời..." />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Phản hồi khách hàng"
                visible={isReplyModalVisible}
                onOk={handleReply}
                onCancel={() => setIsReplyModalVisible(false)}
            >
                <Form form={formReply} layout="vertical">
                    <Form.Item name="reply" label="Nội dung phản hồi" rules={[{ required: true }]}>
                        <TextArea rows={3} placeholder="Cảm ơn quý khách đã góp ý..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DanhGia;