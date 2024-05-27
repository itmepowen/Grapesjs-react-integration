import React, { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "./App.css";

const GrapesJSForm = () => {
  const editorRef = useRef(null);
  const traitContainerRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = grapesjs.init({
        container: "#gjs",
        height: "100vh",
        width: "auto",
        storageManager: {
          type: "local", // Use local storage
          autosave: true,
          autoload: true,
          stepsBeforeSave: 1,
        },
        plugins: ["gjs-blocks-basic"],
        pluginsOpts: {
          "gjs-blocks-basic": {},
        },
      });

      editorRef.current.BlockManager.add("inquiry-form-block", {
        label: "Inquiry Form",
        content: `
          <form id="inquiryForm">
            <input type="text" name="fullName" placeholder="Full Name" />
            <input type="email" name="email" placeholder="Email" />
            <textarea name="message" placeholder="Your Inquiry"></textarea>
            <label for="inquiryType">Type of Inquiry:</label>
            <select name="inquiryType">
              <option value="general">General</option>
              <option value="support">Support</option>
              <option value="sales">Sales</option>
            </select>
            <button type="button" id="submitInquiryBtn">Submit</button>
          </form>
        `,
      });

      editorRef.current.on("load", () => {
        const submitBtn = document.getElementById("submitInquiryBtn");
        if (submitBtn) {
          submitBtn.addEventListener("click", handleSubmit);
        }
      });

      editorRef.current.on("component:selected", (component) => {
        const traitsViewer = editorRef.current.TraitManager.getTraitsViewer();
        const traitsEl = traitsViewer && traitsViewer.el;
        if (traitContainerRef.current && traitsEl) {
          traitContainerRef.current.innerHTML = "";
          traitContainerRef.current.appendChild(traitsEl);
          traitsViewer.render(component);
        }
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleSubmit = () => {
    const formData = new FormData(document.getElementById("inquiryForm"));
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    fetch("https://your-api-endpoint.com/submit-inquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSave = () => {
    const editor = editorRef.current;
    if (editor) {
      editor.store((res) => {
        alert("Template saved successfully!");
      });
    }
  };

  const handleLoad = () => {
    const editor = editorRef.current;
    if (editor) {
      editor.load((res) => {
        alert("Template loaded successfully!");
      });
    }
  };

  return (
    <div className="editor-container">
      <div id="gjs" className="editor-canvas"></div>
      <div
        id="traits-container"
        ref={traitContainerRef}
        className="traits-panel"
      ></div>
      <div className="editor-controls">
        <button onClick={handleSave}>Save Template</button>
        <button onClick={handleLoad}>Load Template</button>
      </div>
    </div>
  );
};

export default GrapesJSForm;
