import { useRef, useState } from "react";
import * as zip from "@zip.js/zip.js";

const Input = () => {
  const [value, setValue] = useState("");
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        type="file"
        ref={input}
        value={value}
        onChange={(e) => {
          const inputElm = input.current as HTMLInputElement;
          const files = inputElm.files as FileList;
          const file = files[0];

          const reader = new zip.BlobReader(file);
          const r = new zip.ZipReader(reader);
          r.getEntries()
            .then((res) => {
              res.forEach((file) => {
                if (file.getData !== undefined) {
                  const name = file.filename;
                  const index = name.lastIndexOf(".");
                  const fileExtension = name.substring(index);
                  const mimeType = zip.getMimeType(fileExtension);

                  const writer = new zip.Data64URIWriter(mimeType);

                  file
                    .getData(writer)
                    .then((res) => {
                      const a = document.createElement(
                        "a"
                      ) as HTMLAnchorElement;
                      a.setAttribute("href", res);
                      a.setAttribute("download", `output${fileExtension}`);
                      document.body.appendChild(a);
                      a.click();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              });
            })
            .catch((err) => {
              console.log("Err:", err);
            });

          setValue(e.target.value);
        }}
      />
    </>
  );
};

export default Input;
