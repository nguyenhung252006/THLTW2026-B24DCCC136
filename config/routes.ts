export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/bai-tap-01',
		name: 'Bài Tập 01',
		icon: 'OrderedListOutlined',
		component: './BaiTap01',
	},
	{
		path: '/bai-tap-02',
		name: 'Bài Tập 02',
		icon: 'OrderedListOutlined',
		component: './BaiTap02',
	},
	{
		path: '/bai-tap-02/Dat-Hang',
		component: './BaiTap02/BaiTap02-DatHang',
	},
	{
		name: 'Game đoán số',
		icon: 'OrderedListOutlined',
		path: '/game-doan-so',
		component: './Game',
	},
	{
		name: 'Theo dõi tiến độ học tập',
		icon: 'OrderedListOutlined',
		path: '/tien-do',
		component: './TienDoHocTap',
	},
	{
		name: 'Oẳn Tù Tì',
		icon: 'OrderedListOutlined',
		path: '/oan-tu-ti',
		component: './OanTuTi',
	},
	{
		name: 'Quản Lý Đề Thi',
		icon: 'OrderedListOutlined',
		path: '/quan-ly-de-thi',
		component: './QuanLyDeThi',
	},




	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
