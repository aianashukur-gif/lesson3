const form = document.getElementById("roomForm");
const result = document.getElementById("result");
const loading = document.getElementById("loading");

const API = "https://inai-col1.fishrungames.com";


form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const studentId = document.getElementById("studentId").value.trim();
    const buildingId = document.getElementById("buildingId").value.trim();
    const roomNumber = document.getElementById("roomNumber").value.trim();

    // Проверяем, что все поля заполнены
    if (!studentId || !buildingId || !roomNumber) {
        result.innerHTML = `
            <div class="alert alert-danger">
                Заполните все поля.
            </div>
        `;
        return;
    }

    // Показываем загрузку
    loading.innerHTML = `
        <div class="alert alert-info">
            Проверяем заявку...
        </div>
    `;

    result.innerHTML = "";

    try {

        // GET 1: проверяем студента
        const studentResponse = await fetch(
            `${API}/students/${studentId}`
        );

        if (!studentResponse.ok) {
            throw new Error("Студент с таким ID не найден.");
        }

        const student = await studentResponse.json();


        // GET 2: проверяем корпус
        const buildingResponse = await fetch(
            `${API}/buildings/${buildingId}`
        );

        if (!buildingResponse.ok) {
            throw new Error("Корпус с таким номером не найден.");
        }

        const building = await buildingResponse.json();


        // GET 3: проверяем комнату
        const roomResponse = await fetch(
            `${API}/rooms/${roomNumber}`
        );

        if (!roomResponse.ok) {
            throw new Error("Комната с таким номером не найдена.");
        }

        const room = await roomResponse.json();


        // Убираем сообщение "Проверяем..."
        loading.innerHTML = "";


        // Проверяем каждое условие
        const isForeignStudent = student.resident === false;
        const isStudentBuilding = building.forStudents === true;
        const isRoomAvailable = room.available === true;


        // Если все условия выполнены
        if (
            isForeignStudent &&
            isStudentBuilding &&
            isRoomAvailable
        ) {

            result.innerHTML = `
                <div class="alert alert-success">
                    <h5>✅ Заявка одобрена</h5>

                    <p>✅ Студент является иногородним.</p>
                    <p>✅ Корпус предназначен для студентов.</p>
                    <p>✅ Комната свободна.</p>

                    <hr>

                    <strong>Студент может заселиться.</strong>
                </div>
            `;

        } else {

            // Если хотя бы одно условие не выполнено
            result.innerHTML = `
                <div class="alert alert-danger">
                    <h5>❌ Заявка отклонена</h5>

                    <p>
                        ${isForeignStudent
                            ? "✅ Студент является иногородним."
                            : "❌ Студент не является иногородним."
                        }
                    </p>

                    <p>
                        ${isStudentBuilding
                            ? "✅ Корпус предназначен для студентов."
                            : "❌ Корпус не предназначен для студентов."
                        }
                    </p>

                    <p>
                        ${isRoomAvailable
                            ? "✅ Комната свободна."
                            : "❌ Комната занята."
                        }
                    </p>
                </div>
            `;
        }

    } catch (error) {

        loading.innerHTML = "";

        result.innerHTML = `
            <div class="alert alert-danger">
                ❌ ${error.message}
            </div>
        `;
    }
});