import { Card, Col, Row, Button } from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    StarOutlined,
    BarChartOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import React from 'react';

const QuanLyTiemCatToc: React.FC = () => (
    <div className="site-card-wrQuanLyTiemCatTocer" style={{ padding: '30px', background: '#f0f2f5' }}>
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <Card
                    title={<span><UserOutlined /> Nhân Viên</span>}
                    hoverable
                    actions={[
                        <Button type="link" href="/quan-ly-tiem-cat-toc/nhan-vien" icon={<ArrowRightOutlined />}>Đi đến</Button>
                    ]}
                >
                    Quản lý danh sách, hồ sơ và thông tin nhân sự.
                </Card>
            </Col>
            <Col span={12}>
                <Card
                    title={<span><CalendarOutlined /> Đặt Lịch Hẹn</span>}
                    hoverable
                    actions={[
                        <Button type="link" href="/quan-ly-tiem-cat-toc/dat-lich" icon={<ArrowRightOutlined />}>Đi đến</Button>
                    ]}
                >
                    Điều phối và theo dõi lịch hẹn của khách hàng.
                </Card>
            </Col>
            <Col span={12}>
                <Card
                    title={<span><StarOutlined /> Đánh Giá</span>}
                    hoverable
                    actions={[
                        <Button type="link" href="/quan-ly-tiem-cat-toc/danh-gia" icon={<ArrowRightOutlined />}>Đi đến</Button>
                    ]}
                >
                    Phản hồi từ khách hàng và xếp hạng hiệu quả làm việc.
                </Card>
            </Col>
            <Col span={12}>
                <Card
                    title={<span><BarChartOutlined /> Báo Cáo và Thống Kê</span>}
                    hoverable
                    actions={[
                        <Button type="link" href="/quan-ly-tiem-cat-toc/bao-cao" icon={<ArrowRightOutlined />}>Đi đến</Button>
                    ]}
                >
                    Biểu đồ tăng trưởng và phân tích dữ liệu kinh doanh.
                </Card>
            </Col>

        </Row>
    </div>
);

export default QuanLyTiemCatToc;