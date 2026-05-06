import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layout, Card, Row, Col, Statistic, Table, Tag, 
  Button, Modal, Form, Input, DatePicker, Select, Typography, 
  message, Space, Progress, Slider, Popconfirm
} from 'antd';
import { 
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ProjectOutlined,
  SearchOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface Task {
  id: string;
  tenTask: string;
  moTa: string;
  deadline: string;
  mucDoUuTien: 'Cao' | 'Trung bình' | 'Thấp';
  trangThai: 'Todo' | 'Doing' | 'Done';
  tienDo: number; // Thêm phần % hoàn thành
}

const STORAGE_KEY = 'KabanBoard_Data';

const KanbanApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentMenu, setCurrentMenu] = useState('dashboard');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) setTasks(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.trangThai === 'Done').length;
    const overdue = tasks.filter(t => 
      t.trangThai !== 'Done' && moment(t.deadline).isBefore(moment(), 'day')
    ).length;
    // Tính % hoàn thành trung bình của tất cả task
    const avgProgress = total > 0 ? Math.round(tasks.reduce((acc, t) => acc + t.tienDo, 0) / total) : 0;
    return { total, done, overdue, avgProgress };
  }, [tasks]);

  const handleAddOrEdit = (values: any) => {
    const progress = values.trangThai === 'Done' ? 100 : (values.tienDo || 0);
    const status = progress === 100 ? 'Done' : values.trangThai;

    const newTask: Task = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      tenTask: values.tenTask,
      moTa: values.moTa,
      deadline: values.deadline.format('YYYY-MM-DD'),
      mucDoUuTien: values.mucDoUuTien,
      trangThai: status,
      tienDo: progress,
    };

    setTasks(editingTask ? tasks.map(t => (t.id === editingTask.id ? newTask : t)) : [...tasks, newTask]);
    message.success(editingTask ? 'Cập nhật thành công' : 'Thêm mới thành công');
    setIsModalVisible(false);
    setEditingTask(null);
    form.resetFields();
  };

  // Nút xác nhận hoàn thành nhanh
  const markAsDone = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, trangThai: 'Done', tienDo: 100 } : t));
    message.success('Đã đánh dấu hoàn thành!');
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const newTasks = [...tasks];
    const idx = newTasks.findIndex(t => t.id === draggableId);
    if (idx !== -1) {
      const newStatus = destination.droppableId as any;
      newTasks[idx].trangThai = newStatus;
      if (newStatus === 'Done') newTasks[idx].tienDo = 100;
      setTasks(newTasks);
    }
  };

  const renderDashboard = () => (
    <div style={{ marginTop: '20px' }}>
      <Row gutter={16}>
        <Col span={6}><Card borderless><Statistic title="Tổng số task" value={stats.total} prefix={<ProjectOutlined />} /></Card></Col>
        <Col span={6}><Card borderless><Statistic title="Hoàn thành" value={stats.done} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#3f8600' }} /></Card></Col>
        <Col span={6}><Card borderless><Statistic title="Quá hạn" value={stats.overdue} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#cf1322' }} /></Card></Col>
        <Col span={6}><Card borderless><Statistic title="Tiến độ chung" value={stats.avgProgress} suffix="%" /></Card></Col>
      </Row>
      <Card title="Tiến độ tổng thể" style={{ marginTop: '20px' }} borderless>
        <Progress percent={stats.avgProgress} status="active" strokeColor="#c00" />
      </Card>
    </div>
  );

  const renderKanban = () => {
    const cols = [{ id: 'Todo', title: 'Cần làm', color: '#f5f5f5' }, { id: 'Doing', title: 'Đang làm', color: '#e6f7ff' }, { id: 'Done', title: 'Hoàn thành', color: '#f6ffed' }];
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '16px', marginTop: '20px', overflowX: 'auto' }}>
          {cols.map(col => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{ background: col.color, padding: '12px', width: '33%', borderRadius: '8px', minHeight: '500px' }}>
                  <Title level={5}>{col.title}</Title>
                  {tasks.filter(t => t.trangThai === col.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(p) => (
                        <Card ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} style={{ marginBottom: '8px' }} size="small"
                          actions={[
                            task.trangThai !== 'Done' && (
                              <Popconfirm title="Hoàn thành task này?" onConfirm={() => markAsDone(task.id)}>
                                <CheckOutlined key="done" style={{ color: 'green' }} />
                              </Popconfirm>
                            ),
                            <Button type="link" size="small" onClick={() => { setEditingTask(task); form.setFieldsValue({ ...task, deadline: moment(task.deadline) }); setIsModalVisible(true); }}>Sửa</Button>
                          ].filter(Boolean) as any}
                        >
                          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{task.tenTask}</div>
                          <Progress percent={task.tienDo} size="small" strokeColor={task.tienDo === 100 ? '#52c41a' : '#c00'} />
                          <div style={{ marginTop: '8px' }}>
                            <Tag color={task.mucDoUuTien === 'Cao' ? 'red' : 'blue'}>{task.mucDoUuTien}</Tag>
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    );
  };

  const renderTable = () => (
    <div style={{ marginTop: '20px' }}>
      <Input placeholder="Tìm kiếm task..." prefix={<SearchOutlined />} style={{ marginBottom: '16px', width: '300px' }} onChange={e => setSearchText(e.target.value)} />
      <Table 
        dataSource={tasks.filter(t => t.tenTask.toLowerCase().includes(searchText.toLowerCase()))} 
        rowKey="id"
        columns={[
          { title: 'Tên task', dataIndex: 'tenTask' },
          { title: 'Tiến độ', dataIndex: 'tienDo', render: (val) => <Progress percent={val} size="small" style={{ width: 120 }} /> },
          { title: 'Ưu tiên', dataIndex: 'mucDoUuTien', render: (val) => <Tag color={val === 'Cao' ? 'red' : 'blue'}>{val}</Tag> },
          { title: 'Deadline', dataIndex: 'deadline' },
          { title: 'Thao tác', render: (_, r) => (
            <Space>
              {r.trangThai !== 'Done' && <Button icon={<CheckOutlined />} onClick={() => markAsDone(r.id)} />}
              <Button type="link" onClick={() => { setEditingTask(r); form.setFieldsValue({ ...r, deadline: moment(r.deadline) }); setIsModalVisible(true); }}>Sửa</Button>
            </Space>
          )}
        ]} 
      />
    </div>
  );

  const getBtnStyle = (menuKey: string) => ({
    border: 'none', background: 'transparent', boxShadow: 'none',
    fontWeight: currentMenu === menuKey ? 'bold' : 'normal',
    color: currentMenu === menuKey ? '#c00' : '#555',
    borderBottom: currentMenu === menuKey ? '2px solid #c00' : '2px solid transparent',
    borderRadius: 0, height: '45px'
  });

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space size={0}>
          <Title level={4} style={{ margin: '0 40px 0 0', color: '#333' }}>KANBAN APP</Title>
          <Button style={getBtnStyle('dashboard')} onClick={() => setCurrentMenu('dashboard')}>Thống kê</Button>
          <Button style={getBtnStyle('kanban')} onClick={() => setCurrentMenu('kanban')}>Kanban Board</Button>
          <Button style={getBtnStyle('list')} onClick={() => setCurrentMenu('list')}>Danh sách Task</Button>
        </Space>
        <Button type="primary" danger icon={<PlusOutlined />} style={{ backgroundColor: '#c00' }} onClick={() => { setEditingTask(null); form.resetFields(); setIsModalVisible(true); }}>Thêm Task mới</Button>
      </Header>

      <Content style={{ padding: '20px 50px' }}>
        {currentMenu === 'dashboard' && renderDashboard()}
        {currentMenu === 'kanban' && renderKanban()}
        {currentMenu === 'list' && renderTable()}
      </Content>

      <Modal title={editingTask ? "Sửa task" : "Thêm task"} visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleAddOrEdit} initialValues={{ tienDo: 0, trangThai: 'Todo' }}>
          <Form.Item name="tenTask" label="Tên task" rules={[{ required: true }]}><Input /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="mucDoUuTien" label="Ưu tiên"><Select><Option value="Cao">Cao</Option><Option value="Trung bình">Trung bình</Option><Option value="Thấp">Thấp</Option></Select></Form.Item></Col>
          </Row>
          <Form.Item name="trangThai" label="Trạng thái"><Select><Option value="Todo">Todo</Option><Option value="Doing">Doing</Option><Option value="Done">Done</Option></Select></Form.Item>
          <Form.Item name="tienDo" label="Tiến độ hoàn thành (%)">
            <Slider min={0} max={100} marks={{ 0: '0%', 50: '50%', 100: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default KanbanApp;

// sua de push lai
