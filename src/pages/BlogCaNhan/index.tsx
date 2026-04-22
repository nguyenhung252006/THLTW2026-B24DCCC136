import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layout, Card, Row, Col, Tag, Input, Pagination, Typography, 
  Divider, Button, Table, Space, Modal, Form, Select, Radio, 
  Popconfirm, message, Avatar, Empty 
} from 'antd';
import { 
  EditOutlined, DeleteOutlined, PlusOutlined, 
  SearchOutlined, ArrowLeftOutlined, UserOutlined,
  FacebookOutlined, GithubOutlined, MailOutlined,
  HomeOutlined, SettingOutlined, InfoCircleOutlined
} from '@ant-design/icons';

const { Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface The { id: string; ten: string; }
interface BaiViet {
  id: string; tieuDe: string; slug: string; tomTat: string; noiDung: string;
  anhDaiDien: string; ngayDang: string; tacGia: string; danhSachThe: string[];
  luotXem: number; trangThai: 'Nháp' | 'Đã đăng';
}

const UngDungBlog: React.FC = () => {
  const [manHinh, setManHinh] = useState<'trang-chu' | 'chi-tiet' | 'gioi-thieu' | 'quan-ly'>('trang-chu');
  const [danhSachBaiViet, setDanhSachBaiViet] = useState<BaiViet[]>([]);
  const [danhSachThe, setDanhSachThe] = useState<The[]>([]);
  const [baiVietChon, setBaiVietChon] = useState<BaiViet | null>(null);
  
  // State quản lý Modal và Form (Đưa lên đây để không vi phạm Hook rules)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dangSuaId, setDangSuaId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const [tuKhoa, setTuKhoa] = useState('');
  const [tuKhoaDebounce, setTuKhoaDebounce] = useState('');
  const [theLoc, setTheLoc] = useState<string | null>(null);
  const [trangHienTai, setTrangHienTai] = useState(1);

  useEffect(() => {
    const duLieuBaiViet = localStorage.getItem('blog_bai_viet');
    const duLieuThe = localStorage.getItem('blog_the');
    if (duLieuBaiViet) setDanhSachBaiViet(JSON.parse(duLieuBaiViet));
    if (duLieuThe) setDanhSachThe(JSON.parse(duLieuThe));
  }, []);

  useEffect(() => {
    localStorage.setItem('blog_bai_viet', JSON.stringify(danhSachBaiViet));
  }, [danhSachBaiViet]);

  useEffect(() => {
    localStorage.setItem('blog_the', JSON.stringify(danhSachThe));
  }, [danhSachThe]);

  useEffect(() => {
    const henGio = setTimeout(() => setTuKhoaDebounce(tuKhoa), 300);
    return () => clearTimeout(henGio);
  }, [tuKhoa]);

  const baiVietHienThi = useMemo(() => {
    return danhSachBaiViet.filter(b => 
      (theLoc ? b.danhSachThe.includes(theLoc) : true) &&
      (b.tieuDe.toLowerCase().includes(tuKhoaDebounce.toLowerCase())) &&
      (manHinh === 'quan-ly' ? true : b.trangThai === 'Đã đăng')
    );
  }, [danhSachBaiViet, theLoc, tuKhoaDebounce, manHinh]);

  const xemChiTiet = (bai: BaiViet) => {
    setDanhSachBaiViet(prev => prev.map(b => b.id === bai.id ? { ...b, luotXem: b.luotXem + 1 } : b));
    setBaiVietChon({ ...bai, luotXem: bai.luotXem + 1 });
    setManHinh('chi-tiet');
    window.scrollTo(0, 0);
  };

  const moForm = (bai?: BaiViet) => {
    if (bai) {
      setDangSuaId(bai.id);
      form.setFieldsValue(bai);
    } else {
      setDangSuaId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const luuBaiViet = (values: any) => {
    values.danhSachThe?.forEach((tenThe: string) => {
      if (!danhSachThe.find(t => t.ten === tenThe)) {
        setDanhSachThe(prev => [...prev, { id: Date.now().toString() + Math.random(), ten: tenThe }]);
      }
    });

    if (dangSuaId) {
      setDanhSachBaiViet(prev => prev.map(b => b.id === dangSuaId ? { ...b, ...values } : b));
      message.success('Đã cập nhật');
    } else {
      const moi: BaiViet = { ...values, id: Date.now().toString(), luotXem: 0, ngayDang: new Date().toLocaleDateString('vi-VN'), tacGia: 'Người dùng' };
      setDanhSachBaiViet([moi, ...danhSachBaiViet]);
      message.success('Đã đăng bài');
    }
    setIsModalOpen(false);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px 50px' }}>
        <div style={{ background: '#fff', padding: '0 24px 24px', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          
          <div style={{ marginBottom: 24, padding: '12px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
            <Button type={manHinh === 'trang-chu' ? 'primary' : 'default'} icon={<HomeOutlined />} onClick={() => setManHinh('trang-chu')}>Trang chủ</Button>
            <Button type={manHinh === 'quan-ly' ? 'primary' : 'default'} icon={<SettingOutlined />} onClick={() => setManHinh('quan-ly')}>Quản trị</Button>
            <Button type={manHinh === 'gioi-thieu' ? 'primary' : 'default'} icon={<InfoCircleOutlined />} onClick={() => setManHinh('gioi-thieu')}>Giới thiệu</Button>
          </div>

          {manHinh === 'trang-chu' && (
            <div>
              <Space style={{ marginBottom: 24 }}>
                <Input placeholder="Tìm tiêu đề..." prefix={<SearchOutlined />} onChange={(e) => setTuKhoa(e.target.value)} style={{ width: 300 }} />
                <Select placeholder="Thẻ" allowClear style={{ width: 150 }} onChange={setTheLoc}>
                  {danhSachThe.map(t => <Option key={t.id} value={t.ten}>{t.ten}</Option>)}
                </Select>
              </Space>
              <Row gutter={[24, 24]}>
                {baiVietHienThi.length === 0 ? <Empty /> : baiVietHienThi.slice((trangHienTai - 1) * 9, trangHienTai * 9).map(bai => (
                  <Col xs={24} sm={12} lg={8} key={bai.id}>
                    <Card hoverable cover={<img src={bai.anhDaiDien || 'https://via.placeholder.com/400x200'} style={{ height: 200, objectFit: 'cover' }} />} onClick={() => xemChiTiet(bai)}>
                      <Card.Meta title={bai.tieuDe} description={<Paragraph ellipsis={{ rows: 2 }}>{bai.tomTat}</Paragraph>} />
                      <div style={{ marginTop: 12 }}>{bai.danhSachThe.map(t => <Tag color="blue" key={t}>{t}</Tag>)}</div>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Pagination style={{ marginTop: 24, textAlign: 'center' }} current={trangHienTai} total={baiVietHienThi.length} pageSize={9} onChange={setTrangHienTai} hideOnSinglePage />
            </div>
          )}

          {manHinh === 'chi-tiet' && baiVietChon && (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <Button icon={<ArrowLeftOutlined />} onClick={() => setManHinh('trang-chu')}>Quay lại</Button>
              <Title style={{ marginTop: 24 }}>{baiVietChon.tieuDe}</Title>
              <img src={baiVietChon.anhDaiDien} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 24 }} />
              <div style={{ whiteSpace: 'pre-wrap', fontSize: 16 }}>{baiVietChon.noiDung}</div>
            </div>
          )}

          {manHinh === 'quan-ly' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4}>Danh sách bài viết</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => moForm()}>Viết bài mới</Button>
              </div>
              <Table dataSource={danhSachBaiViet} rowKey="id" columns={[
                { title: 'Tiêu đề', dataIndex: 'tieuDe' },
                { title: 'Trạng thái', dataIndex: 'trangThai', render: (t) => <Tag color={t === 'Đã đăng' ? 'green' : 'orange'}>{t}</Tag> },
                { title: 'Lượt xem', dataIndex: 'luotXem' },
                { title: 'Hành động', render: (_, r) => (
                  <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => moForm(r)} />
                    <Popconfirm title="Xóa bài?" onConfirm={() => setDanhSachBaiViet(prev => prev.filter(b => b.id !== r.id))}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
                  </Space>
                )}
              ]} />
            </div>
          )}

          {manHinh === 'gioi-thieu' && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Avatar size={100} icon={<UserOutlined />} />
              <Title level={2}>Tác giả</Title>
              <Space size="large" style={{ fontSize: 24 }}><FacebookOutlined /><GithubOutlined /><MailOutlined /></Space>
            </div>
          )}

          <Modal title={dangSuaId ? "Sửa bài" : "Thêm bài"} visible={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} width={700}>
            <Form form={form} layout="vertical" onFinish={luuBaiViet}>
              <Form.Item name="tieuDe" label="Tiêu đề" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="slug" label="Slug" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="anhDaiDien" label="URL Ảnh"><Input /></Form.Item>
              <Form.Item name="danhSachThe" label="Thẻ"><Select mode="tags">{danhSachThe.map(t => <Option key={t.ten} value={t.ten}>{t.ten}</Option>)}</Select></Form.Item>
              <Form.Item name="trangThai" label="Trạng thái" initialValue="Đã đăng"><Radio.Group><Radio value="Đã đăng">Đăng</Radio><Radio value="Nháp">Nháp</Radio></Radio.Group></Form.Item>
              <Form.Item name="tomTat" label="Tóm tắt"><Input.TextArea rows={2} /></Form.Item>
              <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true }]}><Input.TextArea rows={6} /></Form.Item>
            </Form>
          </Modal>

        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Blog Cá Nhân ©2024</Footer>
    </Layout>
  );
};

export default UngDungBlog;