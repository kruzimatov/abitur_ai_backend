<?php

namespace App\Http\Controllers;

use App\Models\Field;

class FieldController extends Controller
{
    public function index()
    {
        $fields = Field::with('subjects:id,name')->get();

        return response()->json($fields);
    }

    public function show($id)
    {
        $field = Field::with('subjects:id,name')->findOrFail($id);

        return response()->json($field);
    }
}
