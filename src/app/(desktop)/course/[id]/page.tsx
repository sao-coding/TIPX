const CoursePage = async ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1>Course Page</h1>
      <p>Course ID: {params.id}</p>
    </div>
  )
}

export default CoursePage
