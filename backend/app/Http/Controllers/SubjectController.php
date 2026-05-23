<?php

namespace App\Http\Controllers;

use App\Models\Subject;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::withCount('topics')->get();

        return response()->json($subjects);
    }

    public function topics($id)
    {
        $subject = Subject::with('topics:id,subject_id,title,order_num')->findOrFail($id);

        return response()->json($subject->topics);
    }
}
