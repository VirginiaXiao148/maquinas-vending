import React, { useEffect, useState } from 'react';

export default function Page() {

  const [reports, setReports] = useState([]);

  // POST /api/reports
  fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        machine_id: '123',
        location: 'Calle Principal, Madrid',
        issue: 'La máquina no devuelve el cambio'
    })
  })
  .then(res => res.json())
  .then(data => console.log(data));

  // PATCH /api/reports/:id
  fetch('/api/reports/1', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'en proceso' })
  })
  .then(res => res.json())
  .then(data => console.log(data));

  // DELETE /api/reports/:id
  fetch('/api/reports/1', {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => console.log(data));

  // GET /api/reports
  useEffect(() => {
    fetch('/api/reports')
    .then(res => res.json())
    .then(data => setReports(data));
  }, []);

  // POST /api/comments
  fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        report_id: 1,
        comment: 'Se ha revisado la máquina, parece ser un problema eléctrico.',
        attachment: 'imagen1.jpg'
    })
  })
  .then(res => res.json())
  .then(data => console.log(data));

  // PATCH /api/comments/:id
  fetch('/api/comments/1', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment: 'Se ha revisado la máquina, parece ser un problema eléctrico.' })
  })
  .then(res => res.json())
  .then(data => console.log(data));

  // DELETE /api/comments/:id
  fetch('/api/comments/1', {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => console.log(data));

  // GET /api/comments
  useEffect(() => {
    fetch('/api/comments')
    .then(res => res.json())
    .then(data => console.log(data));
  }, []);

  return (
    <div></div>
  )
}
