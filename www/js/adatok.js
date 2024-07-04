document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

document.addEventListener('DOMContentLoaded', function() {
  const addForm = document.getElementById('formm');
  const updateForm = document.getElementById('formm2');

  addForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      const formData = new FormData(addForm);
      const jsonData = {};
      formData.forEach((value, key) => {
          jsonData[key] = value;
      });

      const nameExist = await checkName(jsonData.nev);
      if (nameExist) {
          alert('Ilyen nevű már létezik.');
          return;
      }

      fetch(`https://marik.dev.frederik.hu/afakulcsok`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
      })
      .then(resp => {
          if (!resp.ok) {
              throw new Error('Hiba a válaszban');
          }
          return resp.json();
      })
      .then(data => {
          console.log('Sikeres válasz:', data);
          dataf();
      })
      .catch(error => {
          console.error('Hiba a kérésben:', error);
      });
      closeF();
  });

  updateForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      const formData = new FormData(updateForm);
      const jsonData = {};
      formData.forEach((value, key) => {
          jsonData[key] = value;
      });

      const recordId = document.getElementById('recordId2').value;
      const url = `https://marik.dev.frederik.hu/afakulcsok/${recordId}`;
      const nameExist = await checkName(jsonData.nev, recordId);
      if (nameExist) {
          alert('Ilyen nevű már létezik.');
          return;
      }
      fetch(url, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(jsonData),
      })
      .then(resp => {
          if (!resp.ok) {
              throw new Error('Hiba a válaszban');
          }
          return resp.json();
      })
      .then(data => {
          console.log('Sikeres válasz:', data);
          dataf();
      })
      .catch(error => {
          console.error('Hiba a kérésben:', error);
      });
      closeF2();
  });

  async function dataf() {
      try {
          const resp = await fetch("https://marik.dev.frederik.hu/afakulcsok");
          if (!resp.ok) {
              throw new Error(`error: ${resp.status}`);
          }
          const datas = await resp.json();
          console.log(datas);
          if (Array.isArray(datas)) {
              feltoltTablazat(datas);
          } else {console.error('Nem jó a formátum:', datas);}
      } catch (error) {
          console.error('Hiba:', error);
      }
  }
  dataf();

  async function checkName(name, excludeId = null) {
      try {
          const resp = await fetch("https://marik.dev.frederik.hu/afakulcsok");
          if (!resp.ok) {
              throw new Error(`HTTP error! status: ${resp.status}`);
          }
          const datas = await resp.json();
          if (Array.isArray(datas)) {
              return datas.some(record => record.nev === name && record.id !== excludeId);
          } else {
              console.error('Nincs jó formátumban', datas);
              return false;
          }
      } catch (error) {
          console.error('Hiba:', error);
          return false;
      }
  }

  function feltoltTablazat(datas) {
    tableBody.innerHTML = '';

      datas.forEach(elem => {
          const tr = document.createElement('tr');

          for (const kulcs in elem) {
              const td = document.createElement('td');
              td.textContent = elem[kulcs];
              tr.appendChild(td);
          }

          const deleteTd = document.createElement('td');
          const deleteImg = document.createElement('img');
          deleteImg.src = 'img/delete.png';
          deleteImg.alt = 'delete';
          deleteImg.style.cursor = 'pointer';

          deleteImg.onclick = function() {
              if (confirm(`Biztosan törölni szeretné?`)) {
                  fetch(`https://marik.dev.frederik.hu/afakulcsok/${elem.id}`, {
                      method: 'DELETE',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                  })
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Hiba a válaszban');
                      }
                      return response.json();
                  })
                  .then(data => {
                      console.log('Sikeres törlés:', data);
                      tr.remove();
                  })
                  .catch(error => {
                      console.error('Hiba a törlésben:', error);
                  });
              }
          };
          deleteTd.appendChild(deleteImg);
          tr.appendChild(deleteTd);

          
          const updateTd = document.createElement('td');
          const updateImg = document.createElement('img');
          updateImg.src = 'img/update.png';
          updateImg.alt = 'update';
          updateImg.style.cursor = 'pointer';
          updateImg.onclick = function() {
              openf2(elem);
          };
          updateTd.appendChild(updateImg);
          tr.appendChild(updateTd);
          tableBody.appendChild(tr);
      });
  }

  const sidemenu = document.querySelector("aside");
  const menuButton = document.querySelector("#menubutton");
  const closeButton = document.querySelector("#closebutton");
  const tableBody = document.getElementById('tablebody');

  sidemenu.style.display = 'none';

  menuButton.addEventListener('click', () => {
      sidemenu.style.display = 'block';
      menuButton.style.display = 'none';
  });

  closeButton.addEventListener('click', () => {
      sidemenu.style.display = 'none';
      menuButton.style.display = 'block';
  });

});

function openf() {
  document.getElementById("form1").style.display = "block";
  document.getElementById("nev").value = "";
  document.getElementById("afakulcs").value = "";
}

function closeF() {
  document.getElementById("form1").style.display = "none";
}

function closeF2() {
  document.getElementById("form2").style.display = "none";
}

function openf2(record = null) {
  document.getElementById("form2").style.display = "block";
  if (record) {
      document.getElementById("recordId2").value = record.id;
      document.getElementById("nev2").value = record.nev;
      document.getElementById("afakulcs2").value = record.afakulcs;
  }
}
