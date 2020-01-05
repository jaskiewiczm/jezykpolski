
export default function getActivityTypes(body, callback) {
  fetch('/get_activity_types', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then((response)=>{
    if (response.status == 200) {
      return response.json()
    }
    return null
  }).then((response) => {
    if (response != null) {
      callback(response)
    }
  })
}