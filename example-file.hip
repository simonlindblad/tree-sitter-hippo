input = csv { path: "/Users/simon/Downloads/job_placement_data.csv" }
input2 = csv {
    path: "/Users/simon/Downloads/job_placement_data.csv",
    infer_max_records: 100
}

placed_by_gender = fn(input) {
    input
    | select(@status, @work_experience)
    | filter(@status == "Placed")
    | aggregate([@work_experience, @gender], count())
}

placed_by_gender(input)
