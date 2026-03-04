import { Input, Button } from 'antd';
import { useState } from 'react';

function Game() {

    const [numberCorrect, setNumberCorrect] = useState(Math.floor(Math.random() * 101))
    const [number, setNumber] = useState(0);
    const [alert, setAlert] = useState(<></>)
    const [count, setCount] = useState(0);

    const handleCheckNumber = () => {

        if (count == 9) {
            setAlert(
                <h1>Con số chính xác là: {numberCorrect}</h1>
            )
            return;
        }

        if (number == numberCorrect) {
            setCount(count + 1)
            setAlert(
                <h1>Bạn đoán chính xác: {numberCorrect}</h1>
            )
            return;
        }
        if (number > numberCorrect) {
            setCount(count + 1);
            setAlert(
                <>
                    <h1>Bạn đoán quá cao</h1>
                </>
            )
            setNumber(0)
        }
        if (number < numberCorrect) {
            setCount(count + 1);
            setAlert(
                <>
                    <h1>Bạn đoán quá thấp</h1>
                </>
            )
            setNumber(0)
        }
        if (!number || number == 0) {
            <>
                <h1>Hãy nhập số từ 1 - 100</h1>
            </>
        }
    }

    const handleReset = () => {
        setAlert(<></>);
        setNumber(0);
        setNumberCorrect(Math.floor(Math.random() * 101))
        setCount(0);
    }

    return (
        <>
            <div
                style={{
                    margin: "0 20px 20px 0"
                }}
            >
                <h3>Thể lệ: </h3>
                <span>Người chơi nhập một số trong khoảng từ 1 - 100 và có tổng cộng 10 lần nhập</span>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Input
                    type='number'
                    style={{ "width": "40%" }}
                    value={number}
                    onPressEnter={() => { handleCheckNumber() }}
                    onChange={(e) => setNumber(Number(e.target.value))}
                    placeholder="Nhập số dự đoán vào đây" />
                <Button
                    onClick={() => { handleCheckNumber() }}
                    type='primary'
                    style={{ "marginLeft": "20px" }}
                >Xác nhận</Button>
                <Button
                    onClick={() => { handleReset() }}
                    type='primary'
                    style={{ "marginLeft": "20px" }}
                >Đặt lại</Button>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px"
                }}
            >
                {alert}
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px"
                }}
            >
                <h2>Số lần đoán : {count}</h2>
            </div>
        </>
    );
}

export default Game;