<?php

namespace App\Http\Controllers;

use App\Models\Topic;

class TopicController extends Controller
{
    public function show($id)
    {
        $topic = Topic::with('subject:id,name')->findOrFail($id);

        return response()->json($topic);
    }
}
