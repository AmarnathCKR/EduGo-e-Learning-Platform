function Course() {
  return (
    <>
      <div className="grid grid-cols-2 p-5 items-center">
        <div className="">
          <h1 className="text-lg">
            Gather your first ratings and reviews by promoting your course
            through social media and your professional networks. Your course
            will be discoverable in our marketplace where you earn revenue from
            each paid enrollment.
          </h1>
          <h2 className="text-2xl font-bold">How we help you</h2>
          <p className="text-lg">
            Our custom coupon tool lets you offer enrollment incentives while
            our global promotions drive traffic to courses. There’s even more
            opportunity for courses chosen for Instuctor.
          </p>
        </div>
        <div>
          <img
            src="https://s.udemycdn.com/teaching/launch-your-course-v3.jpg"
            alt="img"
          />
        </div>
      </div>
    </>
  );
}

export default Course;
