import React from "react";

import {
  AnalysisMessage,
  FinderMessage,
  MedicalBookMessage,
  PrescriptionMessage,
  TextMessage,
} from "../Messages";

function MessageRenderer({
  message,
  ui,
  analyzing,
  submitAnalysisFollowUp,
}) {

  switch (message.kind) {

    case "analysis":
      return (
        <AnalysisMessage
          key={message.id}
          message={message}
          ui={ui}
          followUpBusy={analyzing}
          onFollowUpSubmit={submitAnalysisFollowUp}
        />
      );

    case "prescription":
      return (
        <PrescriptionMessage
          key={message.id}
          message={message}
          ui={ui}
        />
      );

    case "finder":
      return (
        <FinderMessage
          key={message.id}
          message={message}
          ui={ui}
        />
      );

    case "book":
      return (
        <MedicalBookMessage
          key={message.id}
          message={message}
          ui={ui}
        />
      );

    case "error":
      return (
        <TextMessage
          key={message.id}
          role="assistant"
          title={message.payload.title}
          text={message.payload.text}
          ui={ui}
        />
      );

    default:
      return (
        <TextMessage
          key={message.id}
          role={message.role}
          title={message.title}
          text={message.text}
          ui={ui}
        />
      );
  }

}

export default function MessageList({

  thread,

  ui,

  analyzing,

  submitAnalysisFollowUp,

  threadEndRef,

}) {

  return (

    <div className="mx-auto flex max-w-4xl flex-col gap-4">

      {thread.map((message) => (

        <MessageRenderer
          key={message.id}
          message={message}
          ui={ui}
          analyzing={analyzing}
          submitAnalysisFollowUp={submitAnalysisFollowUp}
        />

      ))}

      <div ref={threadEndRef} />

    </div>

  );

}