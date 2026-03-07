*** Settings ***
Documentation     ชุดการทดสอบพื้นฐาน (Smoke Test) สำหรับโปรเจกต์ EasyPrint
Library           String

*** Variables ***
# ดึงค่า API_URL จาก Environment Variable ที่เราตั้งไว้ใน GitLab (ถ้าไม่มีให้ใช้ค่า Default)
${API_URL}        %{NEXT_PUBLIC_API_URL=http://localhost:3001}

*** Test Cases ***
Check If Environment Variables Are Set
    [Documentation]    ตรวจสอบว่าตัวแปร API_URL ถูกส่งมาให้เทสต์รู้จักไหม
    Should Not Be Empty    ${API_URL}

Verify Basic Math Logic
    [Documentation]    เทสต์ตรรกะเบื้องต้นเพื่อให้มั่นใจว่า Runner ทำงานได้ปกติ
    ${result}=    Evaluate    1 + 1
    Should Be Equal As Integers    ${result}    2

Check API URL Format
    [Documentation]    ตรวจสอบว่า URL ของ API ขึ้นต้นด้วย http หรือ https
    Should Start With    ${API_URL}    http