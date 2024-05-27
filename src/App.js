import React, { useState, useEffect } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import websitePlugin from "grapesjs-preset-webpage";
import basicBlockPlugin from "grapesjs-blocks-basic";
import formPlugin from "grapesjs-plugin-forms";
import "./App.css"; // Import your custom CSS

function App() {
  const [editor, setEditor] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [editingTemplateId, setEditingTemplateId] = useState(null);

  useEffect(() => {
    const storedTemplates = JSON.parse(localStorage.getItem("templates")) || [];
    setTemplates(storedTemplates);

    const editor = grapesjs.init({
      container: "#gjs",
      width: "100%",
      plugins: [websitePlugin, basicBlockPlugin, formPlugin],
      storageManager: false, // Disable default storage manager
    });

    setEditor(editor);
  }, []);

  useEffect(() => {
    localStorage.setItem("templates", JSON.stringify(templates));
  }, [templates]);

  const handleSave = () => {
    const html = editor.getHtml();
    const css = editor.getCss();

    if (editingTemplateId) {
      // Update existing template
      setTemplates(
        templates.map((template) =>
          template.id === editingTemplateId
            ? { ...template, name: templateName, html, css }
            : template
        )
      );
      setEditingTemplateId(null);
    } else {
      // Create new template
      const newTemplate = {
        id: Date.now(),
        name: templateName,
        html,
        css,
      };
      setTemplates([...templates, newTemplate]);
    }

    setTemplateName("");
  };

  const handleEdit = (templateId) => {
    const templateToEdit = templates.find(
      (template) => template.id === templateId
    );
    if (templateToEdit) {
      setTemplateName(templateToEdit.name);
      setEditingTemplateId(templateId);
      editor.setComponents(templateToEdit.html);
      editor.setStyle(templateToEdit.css);
    }
  };

  const handleDelete = (templateId) => {
    setTemplates(templates.filter((template) => template.id !== templateId));
  };

  const handleLoad = (templateId) => {
    const templateToLoad = templates.find(
      (template) => template.id === templateId
    );
    if (templateToLoad) {
      editor.setComponents(templateToLoad.html);
      editor.setStyle(templateToLoad.css);
    }
  };

  return (
    <div className="app-container">
      <div id="gjs"></div>
      <div className="sidebar">
        <ul>
          {templates.map((template) => (
            <li key={template.id} className="template-item">
              <button onClick={() => handleLoad(template.id)}>
                {template.name}
              </button>
              <button onClick={() => handleEdit(template.id)}>Edit</button>
              <button onClick={() => handleDelete(template.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
        <button onClick={handleSave}>
          {editingTemplateId ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default App;
