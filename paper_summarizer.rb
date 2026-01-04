# frozen_string_literal: true

class PaperSummarizer
  attr_accessor :prompt_path
  attr_accessor :file_id

  JSON_PROMPT = <<p
    Respond in JSON format with these fields:
    - "title": SEO-friendly title (60 chars max)
    - "summary": the full summary
    - "tags": array of 3-5 relevant tags
p

  def summarize
    openai = Config.openai_client
    prompt = File.read(prompt_path)

    prompt += JSON_PROMPT
    puts "summarizing file #{file_id} with prompt #{prompt_path} ..."
    response = openai.responses.create(
      model: "gpt-5",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_file",
              file_id: file_id
            },
            {
              type: "input_text",
              text: prompt
            }
          ]
        }
      ],
      )
    title=""
    body=""
    tags=""
    begin
    response[:output].each do |output|
      if output[:content]
        output[:content].each{|content|
          if (content[:type]==:output_text)
            json = JSON.parse(content[:text])
            title = json["title"]
            body = json["summary"]
            tags = json["tags"]
            puts "title: #{title}"
            puts "body: #{body[0..100]} ..."
            puts "tags: #{tags}"
          end
        }
      end
    end
    rescue => e
      puts e
    end
    {title:title,body:body,tags:tags}
  end

  # sample response:
  # {:id=>"resp_05ea76c3e88c267200695806dbc56c81a0a3c0d9bf18ac6992",
  # :created_at=>1767376606, :error=>nil, :incomplete_details=>nil,
  # :instructions=>nil, :metadata=>{}, :model=>"gpt-5-2025-08-07",
  # :object=>:response,
  # :output=>[
  #   {:id=>"rs_05ea76c3e88c267200695806dfbc1481a0983b4119be04d2fe",
  #     :summary=>[], :type=>:reasoning},
  #   {:id=>"msg_05ea76c3e88c26720069580765099c81a0ab3b398c550f390d",
  #     :content=>
  #       [{:annotations=>[], :text=>
  #           "{\n
  #               \"title\": \"Prenatal clues to Kabuki: ears, heart, and the case for WES\",\n
  #               \"summary\": \"Can we spot Kabuki syndrome before birth—and if so, what signs should clinicians look for?\\n\\nStudy at a Glance\\nA Belgian team reports a prenatal case that was only confirmed after birth as Kabuki syndrome, caused by a new, de novo KMT2D mutation. They followed a single pregnancy with detailed 2D/3D ultrasound (3D ultrasound = a volumetric scan that renders the face and ear shape), standard genetic tests (QF‑PCR and chromosomal microarray for copy‑number variants), and targeted biochemical checks. The infant was later diagnosed by a postnatal targeted gene panel; the authors argue whole‑exome sequencing, or WES (reads all protein‑coding genes), should be offered prenatally in similar cases. Mechanistically, KMT2D affects histones (DNA‑packaging proteins) to control gene activity during development. The authors also reviewed recent literature on prenatal Kabuki presentations.\\n\\nWhat They Found\\nThe fetus showed a classic left‑sided congenital heart pattern—hypoplastic aortic arch with suspected coarctation (Shone complex)—plus evolving polyhydramnios and later small‑for‑gestational‑age growth. Early non‑visualization of the gallbladder resolved.\\n\\nDespite repeated 3D facial scans at 25, 30, and 34 weeks, typical Kabuki facial hallmarks were not obvious prenatally. However, external ear shape was abnormal and proved the most informative facial clue: grade‑2 microtia with absent crus of the helix and a protruding, squared upper ear. Two independent expert teams reviewing the same images also found ear anomalies more convincing than facial dysmorphism.\\n\\nAfter birth, the child displayed the recognizable Kabuki symptom profile—arched eyebrows, long eyelid openings, prominent cupped ears, submucous cleft palate/bifid uvula, short fifth fingers with fingertip pads—plus growth delay and microcephaly. Genetics revealed a one‑letter deletion in KMT2D that truncated the protein (a loss‑of‑function change), arising de novo.\\n\\nIn their literature review, the authors highlight that prenatal Kabuki signs are often nonspecific. Still, WES markedly boosts diagnoses when a heart defect co‑exists with other anomalies and microarray is normal; KMT2D turns up disproportionately in fetuses with left‑sided heart lesions.\\n\\nWhy It Matters for Kabuki\\nThis case sharpens a practical takeaway: in fetuses with non‑isolated congenital heart disease—especially left‑sided lesions—plus growth issues or ear anomalies, clinicians should consider Kabuki and offer WES. Earlier recognition enables precise counseling, delivery planning, and neonatal care. It also aligns with how Kabuki works biologically: KMT2D’s role on histones (DNA‑packaging proteins) means small genetic hits can ripple across many organ systems during development, so a multi‑organ prenatal picture fits.\\n\\nPrenatal signs that should raise suspicion of Kabuki\\n- Left‑sided heart defects (coarctation/hypoplastic arch)\\n- Polyhydramnios\\n- Abnormal external ear shape/size\\n- Growth restriction or small‑for‑gestational‑age\\n\\nCaveats\\nThis is a single case, and prenatal facial features can be subtle or absent; ear morphology may be easier to detect consistently than classic Kabuki facial traits. WES was not performed prenatally here, so the timeline advantage is inferred from broader studies. Also, “phenotype” (observable traits/symptoms) varies widely in Kabuki, so no single ultrasound sign is definitive.\",\n
  #               \"tags\": [\n \"Kabuki syndrome\",\n    \"Prenatal diagnosis\",\n    \"KMT2D\",\n    \"Whole-exome sequencing\",\n    \"Congenital heart disease\"\n  ]\n}",
  #               :type=>:output_text, :logprobs=>[]}], :role=>:assistant,
  #             :status=>:completed, :type=>:message}],
  #           :parallel_tool_calls=>true, :temperature=>1.0, :tool_choice=>:auto,
  #           :tools=>[], :top_p=>1.0, :background=>false, :max_output_tokens=>nil,
  #           :max_tool_calls=>nil, :previous_response_id=>nil, :prompt_cache_key=>nil,
  #           :prompt_cache_retention=>nil, :reasoning=>{:effort=>:medium, :summary=>nil},
  #           :safety_identifier=>nil, :service_tier=>:default, :status=>:completed,
  #         :text=>{:format_=>{:type=>:text}, :verbosity=>:medium}, :top_logprobs=>0,
  #         :truncation=>:disabled, :usage=>{:input_tokens=>7670,
  #         :input_tokens_details=>{:cached_tokens=>0}, :output_tokens=>2329,
  #         :output_tokens_details=>{:reasoning_tokens=>1536}, :total_tokens=>9999},
  #         :user=>nil, :billing=>{:payer=>"openai"}, :completed_at=>1767376764, :store=>true}
end
